import axios from 'axios'

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Autherization'] = token
  }
  else {
    delete axios.defaults.headers.common['Autherization']
  }

}

export default setAuthToken