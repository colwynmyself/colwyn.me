import React from 'react';
import {
  Row,
  Container,
  Col,
} from 'react-bootstrap';

function About() {
  return (
    <div>
      <Container>
          <Row>
            <Col md={{ span: 12, offset: 0 }}>
              I'm a software engineer based in Portland, Oregon. I work primarily on web based backends and on large scale data gathering and analysis. Professionally, Python is my primary language but JavaScript is where I come from. In my spare time I work on learning Rust, playing crosswords and video games, and reading as much as I can about programming.
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default About;
