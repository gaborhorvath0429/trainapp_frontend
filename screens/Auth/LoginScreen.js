import React, { Component } from 'react'
import axios from '../../utils/Axios'
import {
  Image,
  Text,
  View,
  AsyncStorage,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { Button, TextInput, withTheme, Snackbar } from 'react-native-paper'
import { registerForPushNotifications } from '../../utils/PushNotifications'

class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    noAccount: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    registration: {
      marginLeft: 5,
      color: this.props.theme.colors.primary
    },
    logo: {
      marginBottom: 145,
      width: 300,
      height: 200,
      resizeMode: 'stretch'
    },
    input: {
      backgroundColor: 'white'
    }
  })

  state = {
    email: 'asdd@asd.hu',
    password: 'asd',
    snackbarMessage: '',
    snackbarVisible: false,
    loading: false
  }

  onSubmit = async () => {
    Keyboard.dismiss()
    try {
      this.setState({ loading: true })
      let res = await axios.post('/user/login', {
        email: this.state.email,
        password: this.state.password
      })
      if (res.data.success) {
        await AsyncStorage.setItem('userToken', res.data.data.api_token)
        registerForPushNotifications()
        this.setState({ loading: false })
        this.props.navigation.navigate('App')
      }
    } catch (e) {
      console.log(e.response.data.error)
      this.setState({ snackbarVisible: true })
      this.setState({ snackbarMessage: e.response.data.error })
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={this.styles.container}
        behavior="padding"
        keyboardVerticalOffset="200"
      >
        <Image
          style={this.styles.logo}
          source={require('../../assets/logo.png')}
        />
        <TextInput
          style={this.styles.input}
          value={this.state.email}
          label="Email"
          onChangeText={email => this.setState({ email })}
          returnKeyType={'next'}
          keyboardType="email-address"
          onSubmitEditing={() => {
            this.passwordInput.focus()
          }}
          blurOnSubmit={false}
        />
        <TextInput
          style={this.styles.input}
          value={this.state.password}
          label="Jelszó"
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          ref={input => {
            this.passwordInput = input
          }}
          onSubmitEditing={() => this.onSubmit()}
        />
        <Button mode="contained" onPress={() => this.onSubmit()} loading={this.state.loading}>
          Bejelentkezés
        </Button>
        <View style={this.styles.noAccount}>
          <Text>Nincs még fiókod?</Text>
          <Text
            style={this.styles.registration}
            onPress={() => this.props.navigation.navigate('Register')}
          >
            Regisztráció
          </Text>
        </View>
        <Snackbar
          visible={this.state.snackbarVisible}
          onDismiss={() => this.setState({ snackbarVisible: false })}
          duration={3000}
        >
          {this.state.snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    )
  }
}

export default withTheme(LoginScreen)
