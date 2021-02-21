import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

import logo from '../../logo.svg';

import './Header.scss';

function Header() {
  return (
    <Navbar sticky="top" bg="primary" expand="lg" className="header">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} className="header_logo" alt="colwyn.me" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-nav" />

        <Navbar.Collapse id="responsive-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About Me</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
