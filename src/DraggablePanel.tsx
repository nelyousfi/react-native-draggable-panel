import * as React from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DEFAULT_PANEL_HEIGHT = SCREEN_HEIGHT - 100;

type Props = {
  children: React.ReactNode;
  visible: boolean;
  animationDuration: number;
  expandable: boolean;
  hideOnPressOutside: boolean;
  overlayBackgroundColor: string;
  overlayOpacity: number;
  borderRadius: number;
  scrollableContent: boolean;
  onDismiss?: () => void;
};

export const DraggablePanel = React.forwardRef((props: Props, ref) => {
  const [animatedValue] = React.useState(new Animated.Value(0));
  const [popupVisible, togglePopup] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [height, setHeight] = React.useState(DEFAULT_PANEL_HEIGHT);
  const scrollViewRef = React.useRef<any>();

  animatedValue.addListener(({value}) => {
    value === 0.5
      ? setHeight(DEFAULT_PANEL_HEIGHT / 2)
      : setHeight(DEFAULT_PANEL_HEIGHT);
  });

  React.useEffect(() => {
    if (props.visible && !popupVisible) {
      show();
    } else if (popupVisible) {
      hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  React.useEffect(() => {
    if (popupVisible) {
      Animated.timing(animatedValue, {
        toValue: 0.5,
        duration: props.animationDuration,
        useNativeDriver: true,
      }).start(() => {
        scrollViewRef.current!.scrollTo({
          x: 0,
          y: SCREEN_HEIGHT / 2,
          animated: false,
        });
        setAnimating(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupVisible]);

  const show = () => {
    setAnimating(true);
    togglePopup(true);
  };

  const hide = () => {
    if (!animating) {
      setAnimating(true);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: props.animationDuration,
        useNativeDriver: true,
      }).start(() => {
        togglePopup(false);
        setAnimating(false);
        props.onDismiss && props.onDismiss();
      });
    }
  };

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!animating) {
      const y = event.nativeEvent.contentOffset.y;
      if (!props.expandable && y < SCREEN_HEIGHT / 2) {
        return;
      }
      animatedValue.setValue(1 - y / SCREEN_HEIGHT);
      if (y === SCREEN_HEIGHT) {
        togglePopup(false);
        props.onDismiss && props.onDismiss();
      }
    }
  };

  return (
    <Modal
      isVisible={popupVisible}
      backdropOpacity={0}
      animationInTiming={1}
      animationIn={'fadeIn'}
      style={styles.modal}>
      <View style={styles.popupContainer}>
        <Animated.View
          style={{
            ...styles.popupOverlay,
            backgroundColor: props.overlayBackgroundColor,
            opacity: animatedValue.interpolate({
              inputRange: [0, 0.5],
              outputRange: [0, props.overlayOpacity],
              extrapolate: 'clamp',
            }),
          }}
        />
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContainer}
          onScroll={onScroll}
          bounces={false}
          showsVerticalScrollIndicator={false}
          decelerationRate={0}
          snapToInterval={SCREEN_HEIGHT / 2}>
          <TouchableWithoutFeedback
            style={styles.hideContainer}
            disabled={!props.hideOnPressOutside}
            onPress={hide}>
            <View style={styles.hideContainer} />
          </TouchableWithoutFeedback>
        </ScrollView>
        <Animated.View
          style={[
            styles.popupContentContainer,
            {
              borderRadius: props.borderRadius,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -DEFAULT_PANEL_HEIGHT],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.indicator} />
          <View style={[{height}, styles.contentContainer]}>
            {props.scrollableContent ? (
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                {props.children}
              </ScrollView>
            ) : (
              <View style={styles.content}>{props.children}</View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

DraggablePanel.defaultProps = {
  visible: false,
  animationDuration: 300,
  expandable: true,
  hideOnPressOutside: true,
  overlayBackgroundColor: 'black',
  overlayOpacity: 0.8,
  borderRadius: 32,
  scrollableContent: true,
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  popupContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  popupContentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    bottom: -DEFAULT_PANEL_HEIGHT,
    height: DEFAULT_PANEL_HEIGHT,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 60,
    height: 4,
    borderRadius: 50,
    top: -16,
  },
  scroll: {
    ...StyleSheet.absoluteFillObject,
    transform: [{rotate: '180deg'}],
  },
  scrollContainer: {
    height: SCREEN_HEIGHT * 2,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  hideContainer: {
    flex: 1,
  },
});
