import axios from 'axios';
import {authHeader} from '../../auth';

const POST_URL = 'http://localhost:8000/api/v1/posts/';

export const get_posts = (page, keyword, gerne, publisher, start_at, end_at) => {
  let params = `page=${page}`;
  params += keyword ? `&keyword=${keyword}` : '';
  params += gerne ? `&gerne_id=${gerne}` : '';
  params += publisher ? `&publisher_id=${publisher}` : '';
  params += start_at ? `&start_at=${start_at}` : '';
  params += end_at ? `&end_at=${end_at}` : '';

  return axios.get(`${POST_URL}?${params}`)
  .then(res => res)
  .catch(error => error.response)

}

export const get_post = (id) => {
  return axios.get(`${POST_URL}${id}`, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const get_post_image = (pk) => {
  return `${POST_URL}${pk}/image`;
}

export const get_recommend_posts = (gerne) => {
  let url = `${POST_URL}recommend`
  if (gerne) {
    url += `?gerne_id=${gerne}`
  }
  return axios.get(url, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}

export const create_click = (id) => {
  return axios.post(`${POST_URL}click`, {post_id: id}, {headers: authHeader()})
  .then(res => res)
  .catch(error => error.response)
}
