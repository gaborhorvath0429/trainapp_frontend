import Axios from 'axios'
import { AsyncStorage } from 'react-native';
const baseURL = 'http://192.168.0.24:8084/api'
const instance = Axios.create({baseURL})

instance.interceptors.request.use(
  async config => {
    if (!config.headers.Authorization) {
      let token = await AsyncStorage.getItem('userToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => Promise.reject(error)
)

export default instance