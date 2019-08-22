import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/Heading/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import DefaultButton from '../../components/UI/DefaultButton/DefaultButton';

import validate from '../../utility/validation';

import backgroundImage from '../../assets/background.jpg';

import { tryAuth, autoSignIn } from '../../store/actions/index';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode:
        Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
      authMode: 'login',
      controls: {
        email: {
          value: '',
          valid: false,
          validationRules: {
            isEmail: true,
          },
          touched: false,
        },
        password: {
          value: '',
          valid: false,
          validationRules: {
            minLength: 6,
          },
          touched: false,
        },
        confirmPass: {
          value: '',
          valid: false,
          validationRules: {
            isEqualTo: 'password',
          },
          touched: false,
        }
      },
    };
    Dimensions.addEventListener('change', this.updateStyles);
  };

  componentDidMount() {
    this.props.onAutoSignIn();
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  };
  switchAuthModeHandle = () => {
    this.setState(prevState => {
      return {
        authMode: this.state.authMode === 'login' ? 'signup' : 'login',
      };
    });
  };
  updateStyles = dims => {
    /**
     * @param obj contains screen and window objects including the height and width of the device when it rotates
     */
    // console.log(dims);
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait' : 'landscape',
    });
  };
  handleLogin = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
    };
    this.props.onTryAuth(authData, this.state.authMode);
  };
  handlePress = () => {
    this.switchAuthModeHandle();
  };
  updateInputState = (key, val) => {
    // connected to isEqualTo property for the confirmPass only
    let connectedValue = {};
    if (this.state.controls[key].validationRules.isEqualTo) {
      const equalControl = this.state.controls[key].validationRules.isEqualTo; //returns password string
      const equalValue = this.state.controls[equalControl].value; //It finds the password property objects and returns password property value
      /* console.log('===Check===');
      console.log(equalControl);
      console.log(equalValue);
      console.log('===End==='); */
      connectedValue = {
        ...connectedValue,
        isEqualTo: equalValue,
      };
    }
    this.setState(prev => {
      return {
        controls: {
          ...prev.controls,
          [key]: {
            ...prev.controls[key],
            value: val,
            valid: validate(
              val,
              prev.controls[key].validationRules,
              connectedValue,
            ),
            touched: true,
          },
        },
      };
    });
  };

  render() {
    let headingText = null;
    if (this.state.viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText style={styles.textHeading}> Please login </HeadingText>
        </MainText>
      );
    }
    let confirmPassControl = null;
    if (this.state.authMode === 'signup') {
      confirmPassControl = (
        <View
          style={
            this.state.viewMode === 'portrait'
              ? styles.portraitPasswordWrapper
              : styles.landscapePasswordWrapper
          }
        >
          <DefaultInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            style={styles.input}
            value={this.state.controls.confirmPass.value}
            onChangeText={val => {
              this.updateInputState('confirmPass', val);
            }}
            valid={this.state.controls.confirmPass.valid}
            touched={this.state.controls.confirmPass.touched}
          />
        </View>
      );
    }
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {headingText}
          <DefaultButton color="red" onPress={this.handlePress}>
            Switch to {this.state.authMode === 'login' ? 'Sign up' : 'Login'}
          </DefaultButton>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
              <DefaultInput
                placeholder="Email"
                keyboardType="email-address"
                style={styles.input}
                value={this.state.controls.email.value}
                onChangeText={val => this.updateInputState('email', val)}
                valid={this.state.controls.email.valid}
                touched={this.state.controls.email.touched}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <View
                style={
                  this.state.viewMode === 'portrait' ||
                  this.state.authMode === 'login'
                    ? styles.portraitPasswordContainer
                    : styles.landscapePasswordContainer
                }
              >
                <View
                  style={
                    this.state.viewMode === 'portrait' ||
                    this.state.authMode === 'login'
                      ? styles.portraitPasswordWrapper
                      : styles.landscapePasswordWrapper
                  }
                >
                  <DefaultInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                    value={this.state.controls.password.value}
                    onChangeText={val => {
                      this.updateInputState('password', val);
                    }}
                    valid={this.state.controls.password.valid}
                    touched={this.state.controls.password.touched}
                  />
                </View>
                {confirmPassControl}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <DefaultButton
            color="#29aaf4"
            onPress={this.handleLogin}
            disabled={
              !this.state.controls.email.valid ||
              !this.state.controls.password.valid ||
              (!this.state.controls.confirmPass.valid &&
                this.state.authMode === 'signup')
            }
          >
            Submit
          </DefaultButton>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  backgroundImage: {
    width: '100%',
    flex: 1,
  },
  input: {
    backgroundColor: '#eee',
    borderColor: 'black',
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  landscapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portraitPasswordWrapper: {
    width: '100%',
  },
  landscapePasswordWrapper: {
    width: '45%',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    onAutoSignIn: () => dispatch(autoSignIn())
  };
};

export default connect(null, mapDispatchToProps)(AuthScreen);
