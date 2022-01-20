import {useEffect, useState} from 'react';

import {check_user_is_expired} from './utils';
import {login, register, logout} from './apis';
import {authHeader} from './headers';

const withAuthorization = (Component) => {
  function WithAuthorization() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      let myInterval = setInterval(() => setUser(check_user_is_expired()), 2000);
      return () => {
        clearInterval(myInterval);
      }
    }, [])

    return(
      <Component user={user} />
    )
  }
  return WithAuthorization;
}


export {login, register, logout, authHeader};
export default withAuthorization;
