import axios from 'axios';
import {authHeader} from '../../auth';

const COMMENT_URL = 'http://localhost:8000/api/v1/comments/';
const REPLY_PATH = 'replies';

export const get_comments = (post_id, page) => {
  return axios.get(`${COMMENT_URL}?post_id=${post_id}&page=${page}`)
  .then(res => res)
  .catch(error => error.response)
}

export const create_comment = (post_id, text) => {
  return axios.post(COMMENT_URL, {'text': text, 'post_id': post_id}, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}


export const get_replies = (comment_id) => {
  return axios.get(`${COMMENT_URL}${comment_id}/${REPLY_PATH}`)
  .then(res => res)
  .catch(error => error.response)
}

export const create_reply = (comment_id, text) => {
  return axios.post(`${COMMENT_URL}${comment_id}/${REPLY_PATH}`, {'text': text}, {'headers': authHeader()})
  .then(res => res)
  .catch(error => error.response)
}
