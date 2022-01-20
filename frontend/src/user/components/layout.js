import {useEffect, useState} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import UserNavigation from './navigation';

const UserLayout = ({children}) => {
  return (
    <div>
      <UserNavigation/>
      <Outlet/>
    </div>
  )
}

export default UserLayout;
