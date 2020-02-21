import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import DraggablePanel from 'react-native-draggable-panel';

export default function() {
  const ref = React.useRef();

  return (
    <View style={styles.container}>
      <Text>Some text should goes in here</Text>
      <Button
        onPress={() => {
          ref.current.show();
        }}
        title="Open Panel"
      />
      <DraggablePanel ref={ref}>
        <Text>Another content</Text>
      </DraggablePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
