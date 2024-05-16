import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import logo from '../images/CareerLogo.png'; // Replace './logo.png' with the actual path to your logo image

function test() {
  return (
    <Container className="container">
      <Row className="LoginContainerRow">
        <Col md={6} className="m-auto shadow rounded py-5 px-5">
          <Row className="justify-content-center">
            <Col>
              <Image src={logo} className="companyLogo img-fluid imglogo" />
            </Col>
          </Row>
          <Row>
            <Col md={12} className="my-2">
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email" />
              </Form.Group>
            </Col>
            <Col md={12} className="my-2">
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" className="mt-3">
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default test;
