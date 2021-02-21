import React from 'react';
import Container from 'react-bootstrap/Container';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import Header from '../header/Header';
import Home from '../home/Home';
import Contact from '../contact/Contact';
import About from '../about/About';

import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Container className="app">
        <Switch>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/contact">
            <Contact />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
