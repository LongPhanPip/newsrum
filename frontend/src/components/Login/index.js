import React from 'react';

import {Container, Row, Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AuthService from '../../services/auth.service';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
      loading: true,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleLogin = (e) => {
    e.preventDefault();

    AuthService.login(this.state.username, this.state.password).then(
      res => {
        if (res.status == 401) {
          ;
        }
        else {
          this.props.navigate('/profile');
        }
      }
    )
  }

  onChange = (e) => {
    this.setState(state => ({[e.target.name]: e.target.value}))
  }

  render() {
    return (
      <Container fluid="lg" className="w-25 p-4">
        <Row className="justify-content-center">
          <Form noValidate validated onSubmit={this.handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control required name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.onChange}/>
              <Form.Text className="text-muted">
                If you don't have username you can register it <a href="/register">here</a>
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control required name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.onChange}/>
            </Form.Group>
             <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          </Row>
        </Container>
    );
  };
}

const withRoute = (Component) => (props) => {
  const navigate = useNavigate();
  return (<Component navigate={navigate} {...props} />);
};


export default withRoute(LoginForm);
