import React from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import LoginScreen from './screens/Auth/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import AuthLoadingScreen from './screens/Auth/AuthLoadingScreen'
import RegisterScreen from './screens/Auth/RegisterScreen';

const AppStack = createStackNavigator({ Home: HomeScreen })
const AuthStack = createStackNavigator({ Register: RegisterScreen, Login: LoginScreen })

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#222D68'
  }
}

const Navigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
)

export default App = () => {
  return (
    <PaperProvider theme={theme}>
      <Navigator />
    </PaperProvider>
  )
}
