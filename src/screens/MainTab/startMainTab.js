import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

const startTab = () => {
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? 'md-map' : 'ios-map', 30),
    Icon.getImageSource(
      Platform.OS === 'android' ? 'md-share-alt' : 'ios-share',
      30,
    ),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-menu' : 'ios-menu', 30),
  ])
    .then(result => {
      Navigation.startTabBasedApp({
        tabs: [
          {
            screen: 'awesome-places.FindPlace',
            title: 'Find Place',
            label: 'Find Place',
            icon: result[0],
            navigatorButtons: {
              leftButtons: [
                {
                  icon: result[2],
                  title: 'Menu',
                  id: 'SideDrawerToggle',
                },
              ],
            },
          },
          {
            screen: 'awesome-places.SharePlace',
            title: 'Share Place',
            label: 'Share Place',
            icon: result[1],
            navigatorButtons: {
              leftButtons: [
                {
                  icon: result[2],
                  title: 'Menu',
                  id: 'SideDrawerToggle',
                },
              ],
            },
          },
        ],
        drawer: {
          left: {
            screen: 'awesome-places.SideDrawer',
          },
        },
        tabsStyle: {
          tabBarButtonColor: '#ff8533',
          tabBarSelectedButtonColor: '#b34700',
          tabBarBackgroundColor: '#ffe0cc',
          initialTabIndex: 1,
        },
        appStyle: {
          tabBarButtonColor: '#ff8533',
          tabBarSelectedButtonColor: '#b34700',
          initialTabIndex: 1,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export default startTab;
