import axios from 'axios';
import {authHeader} from '../../auth';
import default_avatar from '../../assets/images/default_avatar.png';

const PROFILE_URL = 'http://localhost:8000/api/v1/profiles';
const AVATAR_PATH = 'avatar';

export const get_profile_avatar = (profile) => {
  const avatar = profile.avatar ? `${PROFILE_URL}/${profile.account.id}/${AVATAR_PATH}` : default_avatar;
  return avatar;
}
