import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DraggablePanel from 'react-native-draggable-panel';

export default function() {
  const ref = React.useRef();
  const ref2 = React.useRef();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lorem Ipsum</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>
          "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit..."
        </Text>
        <Button
          onPress={() => {
            ref.current.show();
          }}
          title="Open Panel"
        />
        <Button
          onPress={() => {
            ref2.current.show();
          }}
          title="Open Panel 2"
        />
        <DraggablePanel
          ref={ref}
          expandable={true}
          hideOnPressOutside={true}
          overlayOpacity={1}
          borderRadius={0}
          height={300}>
          <View style={styles.contentContainer}>
            <Button
              title={'HIDE'}
              onPress={() => {
                ref.current.hide();
              }}
            />
            <View style={styles.icon} />
            <Text style={styles.title}>Lorem Ipsum</Text>
            <View style={styles.items}>
              <View>
                <Text style={styles.title2}>What is Lorem Ipsum?</Text>
                <Text style={styles.subtitle}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <View>
                <Text style={styles.title2}>Why do we use it?</Text>
                <Text style={styles.subtitle}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </View>
              <View>
                <Text style={styles.title2}>Where does it come from?</Text>
                <Text style={styles.subtitle}>
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text.
                </Text>
              </View>
              <View>
                <Text style={styles.title2}>What is Lorem Ipsum?</Text>
                <Text style={styles.subtitle}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <View>
                <Text style={styles.title2}>Why do we use it?</Text>
                <Text style={styles.subtitle}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </View>
              <View>
                <Text style={styles.title2}>Where does it come from?</Text>
                <Text style={styles.subtitle}>
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text.
                </Text>
              </View>
            </View>
          </View>
        </DraggablePanel>
        <DraggablePanel
          ref={ref2}
          expandable={true}
          height={400}
          animationDuration={2000}
          borderRadius={0}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Array.from(Array(100)).map((_, i) => (
              <TouchableOpacity key={`text_${i}`}>
                <Text>Text {i}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  text: {
    textAlign: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: 'gold',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title2: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  items: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 20,
  },
});
