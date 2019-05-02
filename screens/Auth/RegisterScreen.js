import React, { Component } from 'react'
import axios from '../../utils/Axios'
import {
    Image,
    Text,
    View,
    StyleSheet,
    AsyncStorage,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import {
  withTheme,
  TextInput,
  Button,
  Checkbox,
  Snackbar
} from 'react-native-paper'
import { registerForPushNotifications } from '../../utils/PushNotifications'

class RegisterScreen extends Component {
  static navigationOptions = {
    header: null
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    haveAccount: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    login: {
      marginLeft: 5,
      color: this.props.theme.colors.primary
    },
    trainer: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    checkbox: {
      color: this.props.theme.colors.primary
    },
    logo: {
      width: 300,
      height: 200,
      resizeMode: 'stretch'
    },
    input: {
      backgroundColor: 'white'
    }
  })

  state = {
    name: 'asd',
    email: 'asddd@asd.hu',
    password: 'asd',
    trainer: false,
    snackbarMessage: '',
    snackbarVisible: false,
    loading: false,
    errors: {
      name: false,
      email: false,
      password: false,
      passwordConfirm: false
    }
  }

  onSubmit = async () => {
    Keyboard.dismiss()
    let valid = true
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(this.state.email) === false) {
      this.setState({errors: {...this.state.errors, email: true}})
      valid = false
    }
    if (this.state.name === '') {
      this.setState({errors: {...this.state.errors, name: true}})
      valid = false
    }
    if (!valid) return
    try {
      this.setState({ loading: true })
      let res = await axios.post('/user/register', {
        name: this.state.name,
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
        <View style={this.styles.trainer}>
          <Text style={{ marginTop: 8 }}>Edző vagy?</Text>
          <Checkbox
            color={this.styles.checkbox.color}
            status={this.state.trainer ? 'checked' : 'unchecked'}
            onPress={() => this.setState({ trainer: !this.state.trainer })}
          />
        </View>
        <TextInput
          style={this.styles.input}
          value={this.state.name}
          label="Név"
          onChangeText={name => this.setState({ name })}
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.emailInput.focus()
          }}
          blurOnSubmit={false}
          error={this.state.errors.name}
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
          ref={input => {
            this.emailInput = input
          }}
          blurOnSubmit={false}
          error={this.state.errors.email}
        />
        <TextInput
          style={this.styles.input}
          value={this.state.password}
          label="Jelszó"
          returnKeyType={'next'}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          ref={input => {
            this.passwordInput = input
          }}
          blurOnSubmit={false}
          onSubmitEditing={() => this.passwordConfirmInput.focus()}
          error={this.state.errors.password}
        />
        <TextInput
          style={this.styles.input}
          value={this.state.password}
          label="Jelszó megerősítése"
          secureTextEntry={true}
          ref={input => {
            this.passwordConfirmInput = input
          }}
          onSubmitEditing={() => this.onSubmit()}
          error={this.state.errors.passwordConfirm}
        />
        <Button
          mode="contained"
          onPress={() => this.onSubmit()}
          loading={this.state.loading}
        >
          Regisztráció
        </Button>
        <View style={this.styles.haveAccount}>
          <Text>Van már fiókod?</Text>
          <Text
            style={this.styles.login}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            Bejelentkezés
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

export default withTheme(RegisterScreen)
