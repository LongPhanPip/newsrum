import axios from 'axios';
import {authHeader} from '../../auth';
import default_avatar from '../../assets/images/default_avatar.png';

const USER_URL = 'http://localhost:8000/api/v1/user/';
const ACCOUNT_PATH = 'account';
const PROFILE_PATH = 'profile';
const POST_PATH = 'posts';
const AVATAR_PATH = 'avatar';

export const get_account = () => {
  return axios.get(`${USER_URL}${ACCOUNT_PATH}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_account = (username, email, password='') => {
  const form_data = password ? {
    username : username,
    email: email,
    password: password
  }: {
    username : username,
    email: email
  }

  return axios.put(`${USER_URL}${ACCOUNT_PATH}`, form_data, {
    headers: authHeader()
  }).then(res => res)
  .catch(error => error.response)

}

export const get_profile = () => {
  return axios.get(`${USER_URL}${PROFILE_PATH}`, {
    headers: authHeader()
  })
  .then(res => res)
  .catch(error => error.response)
}

export const update_profile = (firs_name, last_name, date_of_birth, gender, address, interest, avatar) => {
  const form_data = new FormData()
  form_data.append('first_name', firs_name)
  form_data.append('last_name', last_name)
  form_data.append('date_of_birth', date_of_birth)
  form_data.append('gender', gender)
  form_data.append('address', address)
  form_data.append('interest', interest)
  if(avatar) {
    form_data.append('avatar', avatar)
  }

  return axios.put(`${USER_URL}${PROFILE_PATH}`, form_data, {
    headers: authHeader()
  })
  .then(res => res)
  .catch(error => error.response)
}

export const get_profile_avatar = (profile) => {
  const avatar = profile.avatar ? `${USER_URL}${PROFILE_PATH}/${AVATAR_PATH}` : default_avatar;
  return avatar;
}


export const get_posts = () => {
  return axios.get(`${USER_URL}${POST_PATH}`, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const get_post = (pk) => {
  return axios.get(`${USER_URL}${POST_PATH}/${pk}`, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_post = (title, description, image, gerne_id, markdown) => {
  const form_data = new FormData();
  form_data.append('title', title)
  form_data.append('description', description)
  form_data.append('image', image)
  form_data.append('gerne_id', gerne_id)
  form_data.append('markdown', markdown)

  return axios.post(`${USER_URL}${POST_PATH}`, form_data, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_post = (post_id, title, description, image, gerne_id, markdown) => {
  const form_data = new FormData();
  form_data.append('title', title)
  form_data.append('description', description)
  form_data.append('gerne_id', gerne_id)
  form_data.append('markdown', markdown)
  if (image) {
    form_data.append('image', image)
  }

  return axios.put(`${USER_URL}${POST_PATH}/${post_id}`, form_data, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_post = (post_id) => {
  return axios.delete(`${USER_URL}${POST_PATH}/${post_id}`, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

