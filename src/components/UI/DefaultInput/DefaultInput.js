import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const defaultInput = props => {
  return (
    <TextInput
      underlineColorAndroid="transparent"
      {...props}
      style={[
        styles.input,
        props.style,
        !props.valid && props.touched ? styles.invalid : null,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 5,
    marginTop: 8,
    marginBottom: 8,
  },
  invalid: {
    borderColor: 'red',
    backgroundColor: '#f9c0c0',
  },
});

export default defaultInput;
