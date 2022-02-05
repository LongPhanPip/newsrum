import axios from 'axios';
import {authHeader} from '../../auth';

const ADMIN_URL = 'http://localhost:8000/api/v1/admin/';
const PUBLISHER_PATH = 'publishers/';
const FEED_PATH = 'feeds/';
const POST_PATH = 'posts/';
const GERNE_PATH = 'gernes/';
const ACCOUNT_PATH = 'accounts/';
const REC_PATH = 'recommenders/';


export const search_publisher = (keyword) => {
  return axios.get(`${ADMIN_URL}${PUBLISHER_PATH}search?keyword=${keyword}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}


export const get_publishers = () => {
  return axios.get(`${ADMIN_URL}${PUBLISHER_PATH}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const get_feeds_by_publisher = (id) => {
  return axios.get(`${ADMIN_URL}${PUBLISHER_PATH}${id}/feeds`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_publisher = (id, name, url, logo) => {
  return axios.put(`${ADMIN_URL}${PUBLISHER_PATH}${id}`, {
    name, url, logo
  }, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_publisher = (name, url, logo) => {
  return axios.post(`${ADMIN_URL}${PUBLISHER_PATH}`, {
    name, url, logo
  }, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_publisher = (id) => {
  return axios.delete(`${ADMIN_URL}${PUBLISHER_PATH}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_feed = (id, url, gerne) => {
  let data = {"publisher_id": id, "url": url}
  if (gerne) {
    data['gerne_id'] = gerne
  }
  return axios.post(`${ADMIN_URL}${PUBLISHER_PATH}${id}/feeds`,
    data,
    {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_feed = (id, url) => {
  return axios.put(`${ADMIN_URL}${PUBLISHER_PATH}${FEED_PATH}${id}`,
    {"url": url},
    {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}


export const delete_feed = (id) => {
  return axios.delete(`${ADMIN_URL}${PUBLISHER_PATH}${FEED_PATH}${id}`,
    {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const get_posts_by_feed = (id) => {
  return axios.get(`${ADMIN_URL}${PUBLISHER_PATH}${FEED_PATH}${id}/posts`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const get_web_posts = (page) => {
  return axios.get(`${ADMIN_URL}${POST_PATH}web?page=${page}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const search_web_post = (page, keyword, gerne, publisher, start_at, end_at) => {
  let params = "";
  params += `page=${page}`
  params += keyword ? `&keyword=${keyword}` : ''
  params += gerne ? `&gerne_id=${gerne}` : ''
  params += publisher ? `&publisher_id=${publisher}` : ''
  params += start_at ? `&start_at=${start_at}` : ''
  params += end_at ? `&end_at=${end_at}` : ''

  return axios.get(`${ADMIN_URL}${POST_PATH}web/search?${params}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_web_post = (title, description, created_at, gerne, url, author, publisher, image_url) => {
  return axios.post(`${ADMIN_URL}${POST_PATH}web`, {
    title: title,
    description: description,
    created_at: created_at,
    gerne_id: gerne,
    url: url,
    author: author,
    publisher_id: publisher,
    image_url: image_url},
    {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)

}

export const update_web_post = (id, title, description, created_at, gerne, url, author, publisher, image_url) => {
  return axios.put(`${ADMIN_URL}${POST_PATH}web/${id}`, {
    title: title,
    description: description,
    created_at: created_at,
    gerne_id: gerne,
    url: url,
    author: author,
    publisher_id: publisher,
    image_url: image_url,
    status: "P"},
    {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_post = (id, status) => {
  return axios.put(`${ADMIN_URL}${POST_PATH}${id}`, {status}, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_post = (id) => {
  return axios.delete(`${ADMIN_URL}${POST_PATH}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error. response)
}


export const search_gerne = (keyword) => {
  return axios.get(`${ADMIN_URL}${GERNE_PATH}search?keyword=${keyword}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const update_gerne = (id, name, description) => {
  return axios.put(`${ADMIN_URL}${GERNE_PATH}${id}`,
  {
    name,
    description
  },
  {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_gerne = (id) => {
  return axios.delete(`${ADMIN_URL}${GERNE_PATH}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_gerne = (name, description) => {
  return axios.post(`${ADMIN_URL}${GERNE_PATH}`,
  {
    name, description
  }, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}


export const search_account = (page, keyword, start_at, end_at, is_admin) => {
  let params = "";
  params += `page=${page}`;
  params += keyword ? `&keyword=${keyword}` : "";
  params += start_at ? `&start_at=${start_at}` : "";
  params += end_at ? `&end_at=${end_at}` : "";
  params += is_admin ? `&is_admin=${is_admin}` : "";
  return axios.get(`${ADMIN_URL}${ACCOUNT_PATH}search?${params}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const active_account = (id, is_active) => {
  return axios.put(`${ADMIN_URL}${ACCOUNT_PATH}${id}`, {is_active: is_active}, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_account = (id) => {
  return axios.delete(`${ADMIN_URL}${ACCOUNT_PATH}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const search_user_post = (page, keyword, gerne, start_at, end_at, status) => {
  let params = "";
  params += `page=${page}`;
  params += keyword ? `&keyword=${keyword}` : "";
  params += start_at ? `&start_at=${start_at}` : "";
  params += end_at ? `&end_at=${end_at}` : "";
  params += gerne ? `&gerne_id=${gerne}` : "";
  params += status ? `&status=${status}`: "";
  return axios.get(`${ADMIN_URL}${POST_PATH}user/search?${params}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}


export const get_recommenders = () => {
  return axios.get(`${ADMIN_URL}${REC_PATH}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_recommender = (params) => {
  return axios.post(`${ADMIN_URL}${REC_PATH}`, {'params': params}, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const use_recommender = (id) => {
  return axios.post(`${ADMIN_URL}${REC_PATH}use/${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const delete_recommender = (id) => {
  return axios.delete(`${ADMIN_URL}${REC_PATH}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error)
}
