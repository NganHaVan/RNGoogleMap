import {
  Navigation
} from 'react-native-navigation';
import {
  Provider
} from 'react-redux';
import {
  View,
  Text
} from 'react-native';
import React, { Component } from 'react';


import AuthScreen from './src/screens/Auth/Authentication';
import SharePlaceScreen from './src/screens/SharePlace/SharePlaceTab';
import FindPlaceScreen from './src/screens/FindPlace/FindPlaceTab';
import configureStore from './src/store/configureStore';
import PlaceDetail from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';

const store = configureStore();
/* export default class App extends Component {
  render() {
    return (
      <View>
      <Text>Hello there</Text>
    </View>
    )
  }
} */

// Register screens
/**
 * Add store and Provider here if you wanna use Redux in a specific component
 */
Navigation.registerComponent(
  'awesome-places.AuthScreen',
  () => AuthScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'awesome-places.SharePlace',
  () => SharePlaceScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'awesome-places.FindPlace',
  () => FindPlaceScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'awesome-places.PlaceDetail',
  () => PlaceDetail,
  store,
  Provider,
);
Navigation.registerComponent(
  'awesome-places.SideDrawer',
  () => SideDrawer,
  store,
  Provider,
);

// Start an app
export default () => Navigation.startSingleScreenApp({
  screen: {
    screen: 'awesome-places.AuthScreen',
    title: 'Log in',
  },
});
