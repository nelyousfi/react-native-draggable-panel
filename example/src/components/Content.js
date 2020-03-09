import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default function Content(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>Consectetur adipisicing elit</Text>
      <Text style={styles.content}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
        blanditiis consequuntur cumque eligendi, esse eum illo quisquam ullam!
        At dolorum ea earum enim fuga ipsa rerum ullam veritatis. Quibusdam,
        veniam! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Aperiam blanditiis consequuntur cumque eligendi, esse eum illo quisquam
        ullam! At dolorum ea earum enim fuga ipsa rerum ullam veritatis.
        Quibusdam, veniam! Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Aperiam blanditiis consequuntur cumque eligendi, esse eum illo
        quisquam ullam! At dolorum ea earum enim fuga ipsa rerum ullam
        veritatis. Quibusdam, veniam! Lorem ipsum dolor sit amet, consectetur
        adipisicing elit. Aperiam blanditiis consequuntur cumque eligendi, esse
        eum illo quisquam ullam! At dolorum ea earum enim fuga ipsa rerum ullam
        veritatis. Quibusdam, veniam!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  subtitle: {
    fontWeight: '400',
    color: '#111',
    fontSize: 14,
    fontStyle: 'italic',
  },
  content: {
    marginTop: 20,
    color: 'black',
    fontSize: 12,
  },
});
