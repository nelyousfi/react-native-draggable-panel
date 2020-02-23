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
  height: number;
  onDismiss?: () => void;
};

export const DraggablePanel = React.forwardRef((props: Props, ref) => {
  const [animatedValue] = React.useState(new Animated.Value(0));
  const [popupVisible, togglePopup] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [height] = React.useState(Math.min(props.height, DEFAULT_PANEL_HEIGHT));
  const scrollViewRef = React.useRef<any>();

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
        toValue: height / DEFAULT_PANEL_HEIGHT,
        duration: props.animationDuration,
        useNativeDriver: true,
      }).start(() => {
        scrollViewRef.current!.scrollTo({
          x: 0,
          y: SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT,
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
        scrollViewRef.current!.scrollTo({
          x: 0,
          y: SCREEN_HEIGHT,
          animated: false,
        });
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
      if (
        !props.expandable &&
        y < SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT
      ) {
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
              inputRange: [0, height / DEFAULT_PANEL_HEIGHT],
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
          snapToOffsets={[
            0,
            SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT,
            SCREEN_HEIGHT,
          ]}>
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
              borderTopLeftRadius: props.borderRadius,
              borderTopRightRadius: props.borderRadius,
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
          <Animated.View style={[styles.content, {height}]}>
            {props.children}
          </Animated.View>
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
  height: DEFAULT_PANEL_HEIGHT / 2,
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
  hideContainer: {
    flex: 1,
  },
  content: {
    width: '100%',
  },
});
