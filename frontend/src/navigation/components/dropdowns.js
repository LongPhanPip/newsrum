import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Dropdown, Image, Spinner } from 'react-bootstrap';

import {logout} from '../../auth';
import {get_profile} from '../../user';
import {get_profile_avatar} from '../../profile';

export const DropdownForUser = (props) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    get_profile().then(res => setProfile(res.data))
  }, [])

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const toPage = (url) => () => {
    navigate(url);
  }

  return (
    <div>
      {profile ?
        <Dropdown className="text-center">
          <Image src={get_profile_avatar(profile)} roundedCircle className="crop-img-sm mx-2"/>
          <Dropdown.Toggle id="dropdown-user" className="bg-white text-secondary border-0  fs-5">
            {profile.first_name ? profile.first_name: profile.account.username}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item className="text-secondary" onClick={toPage('user/account')}>Thông tin tài khoản</Dropdown.Item>
            <Dropdown.Item className="text-secondary" onClick={toPage('user/profile')}>Thông tin cá nhân</Dropdown.Item>
            <Dropdown.Item className="text-secondary" onClick={toPage('user/posts')}>Danh sách bài viết</Dropdown.Item>
            <Dropdown.Item className="text-primary" onClick={toPage('user/create')}>Tạo bài viết mới</Dropdown.Item>
            <Dropdown.Item className="text-danger" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> : <Spinner animation="border" variant="light" />
      }
    </div>
  )
}

export const DropdownForAdmin = (props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const toPage = (url) => () => {
    navigate(url);
  }

  return(
    <Dropdown>
      <Dropdown.Toggle id="dropdown-admin" className="bg-white text-primary border-0  fs-5">
        {'Admin: ' + props.user.username}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item className="text-secondary" onClick={toPage('admin/system')}>Quản lý hệ thống</Dropdown.Item>
        <Dropdown.Item className="text-secondary" onClick={toPage('admin/users')}>Quản lý người dùng</Dropdown.Item>
        <Dropdown.Item className="text-secondary" onClick={toPage('admin/posts')}>Quản lý bài viết bên ngoài</Dropdown.Item>
        <Dropdown.Item className="text-secondary" onClick={toPage('admin/recommender')}>Hệ thống gợi ý</Dropdown.Item>
        <Dropdown.Item className="text-danger" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
