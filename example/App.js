import React from 'react';
import {View, StyleSheet, Text, Button, SafeAreaView} from 'react-native';
import DraggablePanel from 'react-native-draggable-panel';

export default function() {
  const ref = React.useRef();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Screen header</Text>
      </View>
      <View style={styles.content}>
        <Text>Some text should goes in here</Text>
        <Button
          onPress={() => {
            ref.current.show();
          }}
          title="Open Panel"
        />
        <DraggablePanel ref={ref} scrollableContent={false}>
          <Text>Another content</Text>
          <Button
            title={'HIDE'}
            onPress={() => {
              ref.current.hide();
            }}
          />
        </DraggablePanel>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    width: '100%',
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
