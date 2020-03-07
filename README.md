# react-native-draggable-panel

A react native draggable panel for Android and iOS

# Installation

This library is available on npm, install it with: `npm i react-native-draggable-panel` or `yarn add react-native-draggable-panel`.

# Usage

Import react-native-draggable-panel:

```javascript
import DraggablePanel from 'react-native-draggable-panel';
```

### Reactive way

2.  Then simply show it or hide it by setting the `visible` prop to true or false:

```javascript
render () {
  return (
    <DraggablePanel
      visible={this.state.panelVisible}
    >
      <Text>I am a content</Text>
    </DraggablePanel>
  )
}
```

### Declarative way

```javascript
panelRef = React.createRef();

showPanel() {
  this.panelRef.current.show();
}

hidePanel() {
  this.panelRef.current.hide();
}

render () {
  return (
    <DraggablePanel
      ref={this.panelRef}
    >
      <Text>I am a content</Text>
    </DraggablePanel>
  )
}
```

# Available props

| Name                   | Type    | Default           | Description                                                                |
| ---------------------- | ------- | ----------------- | -------------------------------------------------------------------------- |
| visible                | boolean | false             | Controls the panel's visibility                                            |
| animationDuration      | number  | 500               | Controls the duration in ms to show or hide the panel                      |
| expandable             | boolean | false             | Controls if the panel can be expanded or not                               |
| hideOnPressOutside     | boolean | true              | Controls neither to hide the panel when user presses on the overlay or not |
| overlayBackgroundColor | Color   | black             | Controls the backgroundColor of the overlay                                |
| overlayOpacity         | number  | 0.8               | Is a value between 0 and 1 that controls the overlay opacity               |
| borderRadius           | number  | 0                 | Controls the panel top border radius                                       |
| height                 | number  | SCREEN_HEIGHT / 2 | Controls the panel initial height                                          |
