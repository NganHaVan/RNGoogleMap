/**
 * All the settings here are mainly for Android
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { authLogOut } from '../../store/actions/index'

class SideDrawer extends Component {
  render() {
    return (
      <View
        style={[
          styles.container,
          { width: Dimensions.get('screen').width * 0.8 },
        ]}
      >
        <TouchableOpacity onPress={this.props.onLogOut}>
          <View style={styles.drawItem}>
            <Icon
              style={styles.drawItemIcon}
              name="ios-log-out"
              size={30}
              color="#aaa"
            />
            <Text> Sign out </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: 'white',
    flex: 1,
  },
  drawItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#ccc',
  },
  drawItemIcon: {
    marginRight: 15,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onLogOut: () => dispatch(authLogOut())
  }
}

export default connect(null, mapDispatchToProps)(SideDrawer)
