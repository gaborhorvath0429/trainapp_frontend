import React from 'react'
import axios from '../utils/Axios'
import { Button } from 'react-native'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  onPress = async () => {
    try {
      let res = await axios.post('/test')
      console.log(res.data)
    } catch (e) {
      console.log('ERROR', e)
    }
  }
  render() {
    return (
      <Button
        title="You are logged in!"
        onPress={() => this.onPress()}
      />
    );
  }
}