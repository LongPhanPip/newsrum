import axios from 'axios';
import {API_URL, LOGIN_PATH, REGISTER_PATH} from '../constants/api';

class AuthService {
  login(username, password) {
    return axios.post(API_URL + LOGIN_PATH, {
      username,
      password
    })
    .then(res => {
      if (res.data.token.access) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + REGISTER_PATH, {
      username,
      email,
      password
    })
  }

  get_current_user() {
    return JSON.parse(localStorage.getItem('user'));
  }

}

export default new AuthService();

