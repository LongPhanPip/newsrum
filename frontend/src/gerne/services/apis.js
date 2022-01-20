import axios from 'axios';

const GERNE_URL = 'http://localhost:8000/api/v1/gernes/';

export const get_gernes = () => {
  return axios.get(GERNE_URL)
  .then(res => res)
  .catch(res => res.response)
}

export const get_gerne = (id) => {
  return axios.get(`${GERNE_URL}${id}`)
  .then(res => res)
  .catch(res => res.response)
}
