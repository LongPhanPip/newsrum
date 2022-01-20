import {logout} from './apis';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};


const check_user_is_expired = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user) {
    const decodedJwt = parseJwt(user.token.access);
    if (decodedJwt.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return decodedJwt;
  }
  return null;
}

export {check_user_is_expired}
