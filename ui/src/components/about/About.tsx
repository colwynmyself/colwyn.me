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
              I write the code that deploys the code. I've worked primarily with TypeScript, Python, CloudFormation, and Terraform. These days I spend most of my time on the DevOps team at my company, making the development experience easier and safer for our developers.
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default About;
