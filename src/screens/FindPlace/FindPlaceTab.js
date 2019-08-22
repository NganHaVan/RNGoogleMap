import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

class FindPlaceScreen extends Component {
  /**
   * MustDo: Copu this code to everyPage to change the icon button colow
   */
  static navigatorStyle = {
    navBarButtonColor: '#ff8533',
  };

  /**
   * MustDo: Copy this code to every Page that you need user to see the DrawerNavigator
   */
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.state = {
      loaded: false,
      removeAnimation: new Animated.Value(1),
      showAnimation: new Animated.Value(0),
    };
  }

  componentDidMount(){
    this.props.onLoadPlaces();
  }

  onNavigatorEvent = event => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'SideDrawerToggle') {
        this.props.navigator.toggleDrawer({
          side: 'left',
          to: 'open',
        });
      }
    }
  };

  handleSelectedItem = key => {
    const selPlace = this.props.displayedPlaces.find(
      place => place.key === key,
    );
    this.props.navigator.push({
      screen: 'awesome-places.PlaceDetail',
      title: selPlace.name,
      passProps: {
        selectedPlace: selPlace,
      },
    });
  };
  showPlaces = () => {
    Animated.timing(this.state.showAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  placeSearchHandler = () => {
    // this.setState({ loaded: true });
    // console.log(this);
    Animated.timing(this.state.removeAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ loaded: true });
      this.showPlaces();
    });
  };
  /**
   * Render all places: PlaceList
   */

  render() {
    let content = (
      <Animated.View
        style={{
          opacity: this.state.removeAnimation,
          transform: [
            {
              scale: this.state.removeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.25, 1],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity onPress={this.placeSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchBtnText}>Find Places</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
    if (this.state.loaded) {
      content = (
        <Animated.View style={{ opacity: this.state.showAnimation }}>
          <PlaceList
            places={this.props.displayedPlaces}
            onItemSelected={this.handleSelectedItem}
          />
        </Animated.View>
      );
    }
    return (
      <View style={this.state.loaded ? null : styles.buttonContainer}>
        {content}
      </View>
    );
  }
}

const mapStateToProps = states => {
  return {
    displayedPlaces: states.places.places,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadPlaces: () => dispatch(getPlaces())
  }
}

const styles = StyleSheet.create({
  searchButton: {
    borderColor: '#cc5200',
    borderWidth: 3,
    borderRadius: 50,
    padding: 20,
  },
  searchBtnText: {
    color: '#cc5200',
    fontSize: 26,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);
