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

const ANIMATION_DURATION = 300;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = SCREEN_HEIGHT - 100;

type Props = {
  children: React.ReactNode;
  visible?: boolean;
};

export const DraggablePanel = React.forwardRef((props: Props, ref) => {
  const [animatedValue] = React.useState(new Animated.Value(0));
  const [popupVisible, togglePopup] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [height, setHeight] = React.useState(PANEL_HEIGHT);
  const scrollViewRef = React.useRef<any>();

  animatedValue.addListener(({value}) => {
    value === 0.5 ? setHeight(PANEL_HEIGHT / 2) : setHeight(PANEL_HEIGHT);
  });

  React.useEffect(() => {
    if (props.visible && !popupVisible) {
      show();
    } else if (popupVisible) {
      hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  const show = () => {
    setAnimating(true);
    togglePopup(true);

    Animated.timing(animatedValue, {
      toValue: 0.5,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      scrollViewRef.current!.scrollTo({
        x: 0,
        y: SCREEN_HEIGHT / 2,
        animated: false,
      });
      setAnimating(false);
    });
  };

  const hide = () => {
    if (!animating) {
      setAnimating(true);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        togglePopup(false);
        setAnimating(false);
      });
    }
  };

  React.useImperativeHandle(ref, () => ({
    show,
  }));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!animating) {
      const y = event.nativeEvent.contentOffset.y;
      animatedValue.setValue(1 - y / SCREEN_HEIGHT);
      if (y === SCREEN_HEIGHT) {
        togglePopup(false);
      }
    }
  };

  if (!popupVisible) {
    return null;
  }

  return (
    <View style={styles.popupContainer}>
      <Animated.View
        style={{
          ...styles.popupOverlay,
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.5],
            outputRange: [0, 0.8],
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
        <TouchableWithoutFeedback style={styles.hideContainer} onPress={hide}>
          <View style={styles.hideContainer} />
        </TouchableWithoutFeedback>
      </ScrollView>
      <Animated.View
        style={[
          styles.popupContentContainer,
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -PANEL_HEIGHT],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.indicator} />
        <View style={{height}}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {props.children}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  popupContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  popupContentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    bottom: -PANEL_HEIGHT,
    height: PANEL_HEIGHT,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
  content: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  hideContainer: {
    flex: 1,
  },
});
