import * as React from 'react';
import {ReactNode, RefObject} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const SCREEN_HEIGHT: number = Dimensions.get('window').height;
const DEFAULT_PANEL_HEIGHT = SCREEN_HEIGHT - 100;

export type ReactNativeDraggablePanelRef = {
  show: () => void;
  hide: () => void;
};

type Props = {
  children: ReactNode;
  visible?: boolean;
  animationDuration?: number;
  expandable?: boolean;
  hideOnPressOutside?: boolean;
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  borderRadius?: number;
  initialHeight?: number;
  onDismiss?: () => void;
};

export const DraggablePanel = React.forwardRef<
  ReactNativeDraggablePanelRef,
  Props
>(
  (
    {
      visible = false,
      animationDuration = 500,
      expandable = false,
      hideOnPressOutside = true,
      overlayBackgroundColor = 'black',
      overlayOpacity = 0.8,
      borderRadius = 0,
      initialHeight = DEFAULT_PANEL_HEIGHT / 2,
      onDismiss,
      children,
    }: Props,
    ref: React.Ref<ReactNativeDraggablePanelRef>,
  ) => {
    const [animatedValue] = React.useState(new Animated.Value(0));
    const [popupVisible, togglePopupVisibility] = React.useState(false);
    const [animating, setAnimating] = React.useState(false);
    const [height] = React.useState(
      Math.min(initialHeight, DEFAULT_PANEL_HEIGHT),
    );
    const [innerContentHeight, setInnerContentHeight] = React.useState(
      Math.min(initialHeight, DEFAULT_PANEL_HEIGHT),
    );
    const scrollViewRef: RefObject<ScrollView> = React.useRef(null);

    React.useEffect(() => {
      if (!animating) {
        if (visible && !popupVisible) {
          show();
        } else if (popupVisible) {
          hide();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const show = React.useCallback(() => {
      if (!animating) {
        animatedValue.setValue(0);
        setInnerContentHeight(Math.min(initialHeight, DEFAULT_PANEL_HEIGHT));
        setAnimating(true);
        togglePopupVisibility(true);
        Animated.timing(animatedValue, {
          toValue: height / DEFAULT_PANEL_HEIGHT,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(() => {
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT,
            animated: false,
          });
          setAnimating(false);
        });
      }
    }, [animatedValue, animating, animationDuration, height, initialHeight]);

    const hide = React.useCallback(() => {
      if (!animating) {
        setAnimating(true);
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(() => {
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: SCREEN_HEIGHT,
            animated: false,
          });
          togglePopupVisibility(false);
          setAnimating(false);
          onDismiss && onDismiss();
        });
      }
    }, [animatedValue, animating, animationDuration, onDismiss]);

    React.useImperativeHandle<
      ReactNativeDraggablePanelRef,
      ReactNativeDraggablePanelRef
    >(ref, () => ({
      show,
      hide,
    }));

    const onScroll = React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!animating) {
          const {y} = event.nativeEvent.contentOffset;
          if (
            !expandable &&
            y < SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT
          ) {
            return;
          }
          animatedValue.setValue(1 - Math.floor(y) / Math.floor(SCREEN_HEIGHT));
          // >= Fix the android issue, cause for some reason it goes for more than SCREEN_HEIGHT
          // if the use swipes faster
          if (Math.floor(y) >= Math.floor(SCREEN_HEIGHT)) {
            togglePopupVisibility(false);
            setAnimating(false);
            onDismiss && onDismiss();
          }
        }
      },
      [animatedValue, animating, expandable, height, onDismiss],
    );

    const onScrollBeginDrag = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (e.nativeEvent.contentOffset.y !== 0 && expandable) {
          setInnerContentHeight(DEFAULT_PANEL_HEIGHT);
        }
      },
      [expandable],
    );

    const onMomentumScrollEnd = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (expandable) {
          const {y} = e.nativeEvent.contentOffset;
          if (y !== 0) {
            setInnerContentHeight(height);
          } else {
            setInnerContentHeight(DEFAULT_PANEL_HEIGHT);
          }
        }
      },
      [height, expandable],
    );

    return (
      <Modal visible={popupVisible} transparent animated={false}>
        <View style={styles.popupContainer}>
          <Animated.View
            style={{
              ...styles.popupOverlay,
              backgroundColor: overlayBackgroundColor,
              opacity: animatedValue.interpolate({
                inputRange: [0, height / DEFAULT_PANEL_HEIGHT],
                outputRange: [0, overlayOpacity],
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
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            decelerationRate={0}
            snapToOffsets={[
              0,
              SCREEN_HEIGHT - (SCREEN_HEIGHT * height) / DEFAULT_PANEL_HEIGHT,
              SCREEN_HEIGHT,
            ]}>
            <TouchableWithoutFeedback
              disabled={!hideOnPressOutside || animating}
              onPress={hide}>
              <View style={styles.hideContainer} />
            </TouchableWithoutFeedback>
          </ScrollView>
          <Animated.View
            style={[
              styles.popupContentContainer,
              {
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
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
            <View
              style={[
                styles.content,
                {height: expandable ? innerContentHeight : height},
              ]}>
              {children}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
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
