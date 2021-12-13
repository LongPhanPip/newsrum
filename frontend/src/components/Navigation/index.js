import React from 'react';

import {Navbar, Nav, NavLink, Container} from 'react-bootstrap';
import * as ROUTES from '../../constants/routes';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Navbar bg="dark" expand="lg" variant="dark" className="p-4">
        <Navbar.Brand href={ROUTES.HOME}>
          Newsrum
        </Navbar.Brand>
        <NavLink href={ROUTES.LOGIN}>Login</NavLink>
        <NavLink href={ROUTES.REGISTER}>Register</NavLink>
      </Navbar>
    );
  };
}


export default Navigation;
