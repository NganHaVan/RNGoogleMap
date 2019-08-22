import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const mainText = props => {
  return <Text style={styles.mainText}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  mainText: {
    color: 'black',
    fontFamily: 'Arial',
    backgroundColor: 'transparent',
  },
});

export default mainText;
