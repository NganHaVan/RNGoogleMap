import React, { Component } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import DefaultButton from '../UI/DefaultButton/DefaultButton';
import firstImage from '../../assets/beautiful-place.jpg';

class PickImage extends Component {
  constructor(props){
    super(props);
    this.state={
      pickedImage: null
    };
    // console.log(props);
  }

  reset = () => {
    this.setState({
      pickedImage: null
    });
  }
 
  pickImageHandler=()=>{
    ImagePicker.showImagePicker({title:'Pick an image', maxHeight:600, maxWidth:600},res =>{
      console.log(res);
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error: ', res.error);
      } else {
        console.log(res.uri);
        this.setState({
          pickedImage:{
            uri: res.uri
        }
      });
        this.props.onImagePicked(
          {
            uri: res.uri,
            base64: res.data
          });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Image source={this.state.pickedImage} style={styles.previewImage} />
        </View>
        <View style={styles.button}>
          <DefaultButton
            color="violet"
            textColor="red"
            onPress={this.pickImageHandler}
          >
            Pick Image
          </DefaultButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  /**
   * Because PickImage component is wrapped by flex in SharePlaceTab, so it is improtant to wrap the component with width 100% and align it to center
   */
  container: {
    width: '100%',
    alignItems: 'center',
  },
  placeholder: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150,
  },
  button: {
    margin: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});

export default PickImage;
