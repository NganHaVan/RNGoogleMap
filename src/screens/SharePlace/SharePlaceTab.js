import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import HeadingText from "../../components/UI/Heading/HeadingText";
import MainText from "../../components/UI/MainText/MainText";

import PlaceInput from "../../components/PlaceInput/PlaceInput";

import PickImage from "../../components/PickImage/PickImage";
import PickMap from "../../components/PickMap/PickMap";

import { addPlace, startAddPlace } from "../../store/actions/index";
import validate from "../../utility/validation";

class SharePlaceScreen extends Component {
  /**
   * MustDo: Copu this code to everyPage to change the icon button colow
   */
  static navigatorStyle = {
    navBarButtonColor: "#ff8533"
  };

  /**
   * MustDo: Copy this code to every Page that you need user to see the DrawerNavigator
   */
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount(){
    this.reset();
  }

  reset = () => {
    this.setState({
      controls: {
        placeName: {
          value: "",
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true
          }
        },
        location: {
          value: null,
          valid: false
        },
        image: {
          value: null,
          valid: false
        }
      }
    })
  }

  componentDidUpdate(){
    if (this.props.placeAdded) {
      this.props.navigator.switchToTab({tabIndex: 0});
      // this.props.onStartAddPlace();
    }
  }

  onNavigatorEvent = (event) => {
    console.log(event);
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        this.props.onStartAddPlace();
      }
    }
    if (event.type === "NavBarButtonPress") {
      if (event.id === "SideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left",
          to: "open"
        });
      };
    };
  };

  handleTextChange = (val) => {
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val, prevState.controls.placeName.validationRules),
            touched: true
          }
        }
      };
    });
  };

  locationPickHandler=(location)=>{
    this.setState(prevState=>{
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      }
    })
  };

  handlePickImage=(image)=>{
    this.setState(prevState=>{
      return {
        controls:{
          ...prevState.controls,
          image: {
            value: image,
            valid: true
          }
        }
      }
    })
  };

  handlePlaceAdded = () => {
    /**
     * We already set condition for disabled button so we do not need if else here to check the input is empty or not
     */

      this.props.onAddPlace(this.state.controls.placeName.value, this.state.controls.location.value, this.state.controls.image.value);
      this.reset();
      this.imagePicker.reset();
      this.locationPicker.reset();
  };

  render() {
    let submitButton=(
      <Button
              title="Share your place"
              onPress={this.handlePlaceAdded}
              disabled={!this.state.controls.placeName.valid || !this.state.controls.location.valid || !this.state.controls.image.valid}
            />
    );
    if (this.props.isLoading) {
      submitButton=<ActivityIndicator />
    }
    let content = (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share your place with us!</HeadingText>
          </MainText>
          <PickImage onImagePicked={this.handlePickImage} ref={ref => this.imagePicker = ref}/>
          <PickMap onLocationPicked={this.locationPickHandler} ref={ref => this.locationPicker = ref} />
          <View style={styles.input}>
            <PlaceInput
              placeData={this.state.controls.placeName}
              placeNameChangedHandler={this.handleTextChange}
            />
          </View>
          <View style={styles.button}>
            {submitButton}
          </View>
        </View>
      </ScrollView>
    );
    if (Platform.OS === "android") {
      return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-500}>
          {content}
          <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
      );
    }
    return (
      <KeyboardAvoidingView behavior="padding">
        {content}
        <View style={{ height: 100 }} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  input: {
    width: "80%",
    marginTop: 10
  },
  button: {
    marginBottom: 15
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName,location, image)),
    onStartAddPlace: () => dispatch(startAddPlace())
  };
};

const mapStateToProps = (state) =>{
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
