import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

const defaultButton = props => {
  const content = (
    <View
      style={[
        styles.button,
        props.disabled ? styles.disabled : { backgroundColor: props.color },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: props.textColor ? props.textColor : 'white' },
          props.disabled ? styles.disabledText : null,
        ]}
      >
        {props.children}
      </Text>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback {...props} onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableHighlight {...props} onPress={props.onPress}>
      {content}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#6666ff',
    backgroundColor: '#ffb366',
  },
  defaultBackground: {
    backgroundColor: '#ffb366',
  },
  buttonText: {
    color: 'white',
  },
  disabled: {
    backgroundColor: '#eee',
    borderColor: '#aaa',
  },
  disabledText: {
    color: '#aaa',
  },
});

export default defaultButton;
