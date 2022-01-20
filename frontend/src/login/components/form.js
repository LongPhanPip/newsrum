import {useState} from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import {login} from '../../auth';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    login(username, password).then(
      res => {
        if (res.status == 401) {
          setMessage(res.data)
        }
        else {
          navigate('/');
        }
      }
    )
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  return (
      <Form noValidate onSubmit={handleLogin} className="text-center">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Control className="border-secondary p-3 fs-5" required name="username" type="text" placeholder="Tên đăng nhập" value={username} onChange={onChangeUsername}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control className="border-secondary p-3 fs-5" required name="password" type="password" placeholder="Mật khẩu" value={password} onChange={onChangePassword}/>
        </Form.Group>
        <Form.Group className="mb-3 d-flex justify-content-between" controlId="formLink">
          <Link to="/register" className="text-decoration-none">Đăng ký tài khoản mới</Link>
          <Link to="/changepwd" className="text-decoration-none">Quên mật khẩu?</Link>
        </Form.Group>
        <Form.Group className="mb-3 text-center text-danger" controlId="formError">
          <span>{message}</span>
        </Form.Group>
        <Button variant="outline-primary btn-block btn-width" type="submit">
          Đăng nhập
        </Button>
      </Form>
  );
}
