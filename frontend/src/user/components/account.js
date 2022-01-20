import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_account, update_account} from '../services';
import UserNavigation from './navigation';

const UserAccount =  (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    get_account().then(res => {
      setUsername(res.data.username)
      setEmail(res.data.email)
    })
  }, [])

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

  const handleSubmit = (e) => {
    e.preventDefault();
    password === confirmPassword ? update_account(username, email, password) : setMessage('Mật khẩu xác thực không chính xác')
  }

  return(
    <Container>
      <UserNavigation />
      <Row className="justify-content-center">
        <h1 className="fs-2 text-secondary text-center m-4 fw-normal">Tài khoản</h1>
      </Row>
      <Row className="justify-content-center m-4">
        <Col md={6}>
         <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label className="fs-4 text-secondary">Tên đăng nhập</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5" name="username" autoComplete="username" type="text" value={username} onChange={onChangeUsername}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="fs-4 text-secondary">Email</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5" name="email" autoComplete="email" type="email" value={email} onChange={onChangeEmail}/>
          </Form.Group>
          <hr className="my-5"/>
          <h1 className="text-danger fs-4"> Thay đổi mật khẩu</h1>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control className="border-secondary p-3 fs-5" required autoComplete="password" name="password" type="password" value={password} placeholder="Mật khẩu mới" onChange={onChangePassword}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control className="border-secondary p-3 fs-5" required autoComplete="confirm-password" name="confirmPassword" type="password" value={confirmPassword} placeholder="Xác thực mật khẩu" onChange={onChangeConfirmPassword}/>
          </Form.Group>
          <Form.Group className="mb-3 text-center text-danger" controlId="formError">
            <span>{message}</span>
          </Form.Group>
          <Button variant="outline-primary d-block mx-auto btn-width fs-5" type="submit">
            Lưu thay đổi
          </Button>
        </Form>
      </Col>
      </Row>
    </Container>
  )
}

export default UserAccount;
