/**
 * Todos: import font Ionicons in Android, otherwise it is not working
 * I imported font Ionicons to Xcode, not yet to Android
 */

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps'

import { deletePlace } from '../../store/actions/index';

class placeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: 'portrait',
    };
    Dimensions.addEventListener('change', this.updateStyle);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyle);
  }

  updateStyle = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait' : 'landscape',
    });
  };

  handleDelete = () => {
    this.props.onDeletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop();
  };

  render() {
    // console.log('Check PlaceDetail:',this);
    return (
      <View
        style={[
          styles.container,
          this.state.viewMode === 'portrait'
            ? styles.portraitContainer
            : styles.landscapeContainer,
        ]}
      >
      <View style={styles.placeContainer}>
        <View style={styles.subContainer}>
          <Image
            source={this.props.selectedPlace.image}
            style={styles.placeImage}
          />
        </View>
        <View style={styles.subContainer}>
          <MapView initialRegion={{...this.props.selectedPlace.location,
            latitudeDelta: 0.0122,
            longitudeDelta:
          Dimensions.get("window").width /
          Dimensions.get("window").height *
          0.0122}
          }
            style={styles.mapStyle}
          >
            <MapView.Marker coordinate={this.props.selectedPlace.location}/>
          </MapView>
        </View>
        </View>
        <View style={styles.subContainer}>
          <View>
            <Text style={styles.placeName}>
              {this.props.selectedPlace.name}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={this.handleDelete}>
              <View style={styles.deleteButton}>
                <Icon size={30} name="ios-trash" color="red" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: key => dispatch(deletePlace(key)),
  };
};

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1,
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
  },
  deleteButton: {
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
  },
  mapStyle:{
    ...StyleSheet.absoluteFillObject
  },
  placeContainer:{
    flex:2
  }
});

export default connect(null, mapDispatchToProps)(placeDetail);
