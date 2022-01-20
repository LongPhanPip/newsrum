import {useState} from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import {login, register} from '../../auth';


export const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    password === confirmPassword ?
    register(username, email, password).then(
      res => {
        if (Math.trunc(res.status / 100) === 4) {
          setUserNameError(res.data['username'])
          setPasswordError(res.data['password'])
          setEmailError(res.data['email'])
        }
        else {
          navigate('/login');
        }
      }
    ) : setPasswordError('Confirm password is not correct')


  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  return (
      <Form noValidate onSubmit={handleRegister} className="text-center">
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Control className=" border-secondary p-3 fs-5" required autoComplete="username" name="username" type="text" placeholder="Tên đăng nhập" value={username} onChange={onChangeUsername}/>
          <Form.Text className="text-danger">
            {userNameError}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control className=" border-secondary p-3 fs-5" required autoComplete="password" name="password" type="password" placeholder="Mật khẩu" value={password} onChange={onChangePassword}/>
          <Form.Text className="text-danger">
            {passwordError}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Control className=" border-secondary p-3 fs-5" required autoComplete="confirm-password" name="confirmPassword" type="password" placeholder="Xác thực mật khẩu" value={confirmPassword}  onChange={onChangeConfirmPassword}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control className=" border-secondary p-3 fs-5" required name="email" type="email" placeholder="Email" value={email} onChange={onChangeEmail}/>
          <Form.Text className="text-danger">
            {emailError}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3 text-center" controlId="formLink">
          <Link to="/login" className="text-decoration-none">Bạn đã có tài khoản?</Link>
        </Form.Group>
        <Button variant="outline-primary btn-block btn-width " type="submit">
          Đăng nhập
        </Button>
      </Form>
  );
}
