import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';

import logo from '../../logo.svg';

import './Header.scss';

function Header() {
  return (
    <Navbar sticky="top" bg="primary" variant="dark" expand="lg" className="header">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src={logo} className="header_logo" alt="colwyn.me" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-nav" />

        <Navbar.Collapse id="responsive-nav">
          <Nav className="mr-auto">
            <NavLink className="header_link" to="/">Home</NavLink>
            <NavLink className="header_link" to="/about">About Me</NavLink>
            <NavLink className="header_link" to="/contact">Contact</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
