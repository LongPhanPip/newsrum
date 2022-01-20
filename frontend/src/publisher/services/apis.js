import axios from 'axios';

const PUBLISHER_URL = 'http://localhost:8000/api/v1/publishers/';

export const get_publishers = () => {
  return axios.get(PUBLISHER_URL)
  .then(res => res)
  .catch(error => error.response)
}
