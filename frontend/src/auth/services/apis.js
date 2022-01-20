import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const AUTH_URL = 'http://localhost:8000/api/v1/';
const LOGIN_PATH = 'login';
const REGISTER_PATH = 'register';

const login = (username, password) => {
  return axios.post(`${AUTH_URL}${LOGIN_PATH}`, {
    username,
    password
  })
  .then(res => {
    if (res.data.token.access) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res;
  })
  .catch(err => err.response)
}

const register = (username, email, password) => {
  return axios.post(`${AUTH_URL}${REGISTER_PATH}`, {
    username,
    email,
    password
  })
  .then(res => res)
  .catch(err => err.response)
}

const logout = () => {
    localStorage.removeItem("user");
}

export {login, register, logout};
