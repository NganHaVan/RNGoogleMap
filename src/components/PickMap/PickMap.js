import React, { Component } from "react";
import { Text, StyleSheet, View, Image, Dimensions } from "react-native";
import MapView from "react-native-maps";

import DefaultButton from "../UI/DefaultButton/DefaultButton";

class PickMap extends Component {
  componentWillMount(){
    this.reset();
  }
  
  reset = () => {
    this.setState({
      focusedLocation: {
        latitude: 60.2015412,
        longitude: 24.934644,
        latitudeDelta: 0.0122,
        longitudeDelta:
          Dimensions.get("window").width /
          Dimensions.get("window").height *
          0.0122
      },
      locationChosen: false
    });
  }

  pickLocationHandler = (event) => {
    const { coordinate } = event.nativeEvent;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
    this.setState((prevState) => {
      return {
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coordinate.latitude,
          longitude: coordinate.longitude
        },
        locationChosen: true
      };
    });
    this.props.onLocationPicked({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
  };

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Setup the below object like event.nativeEvent so that we can reuse in pickLocationHandler
        const coordsEvent = {
          nativeEvent: {
            coordinate: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          }
        };
        this.pickLocationHandler(coordsEvent);
      },
      (err) => {
        console.log("Error: ", err);
        alert("Fetching position failed, please do it manually!");
      }
    );
  };

  render() {
    let marker = null;
    // console.log(this);

    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
    }
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={this.state.focusedLocation}
          region={!this.state.locationChosen ?this.state.focusedLocation : null}
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={(ref) => (this.map = ref)}
        >
          {marker}
        </MapView>
        <View style={styles.button}>
          <DefaultButton
            color="violet"
            textColor="red"
            onPress={this.getLocationHandler}
          >
            Locate me
          </DefaultButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  /**
   * Because PickMap component is wrapped by flex in SharePlaceTab, so it is improtant to wrap the component with width 100% and align it to center
   */
  container: {
    width: "80%",
    alignItems: "center"
  },
  map: {
    width: "100%",
    height: 250
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: "100%",
    height: "100%"
  }
});

export default PickMap;
