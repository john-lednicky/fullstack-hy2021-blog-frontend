import {
  Row,
  Col,
  Button,
  Form,
  Accordion,
} from 'react-bootstrap';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  showSuccessMessageAction,
  showErrorMessageAction,
} from '../redux/messageReducer';
import { login, logout } from '../redux/loginReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const showSuccessMessage = (message) => {
    dispatch(showSuccessMessageAction(message));
  };
  const showErrorMessage = (message) => {
    dispatch(showErrorMessageAction(message));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      try {
        setValidated(false);
        setUsername('');
        setPassword('');
        await dispatch(login(username, password));
        showSuccessMessage(`Logged in ${username}`);
      } catch (err) {
        showErrorMessage('Username or password is incorrect.');
      }
    }
  };
  return (
    <Accordion className="m-2 p-1">
      <Accordion.Item
        eventKey="0"
        className="bg-light text-primary border rounded-3 border-primary"
      >
        <Accordion.Header>
          <div id="login-card-header" className="fs-5 text-primary">
            <span>
              <i className="m-2 bi bi-key"></i>
            </span>
            <span>login</span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Form
            noValidate
            validated={validated}
            id="login-form"
            autoComplete="off"
            onSubmit={handleLogin}
          >
            <Row className="">
              <Form.Group controlId="loginUsername" className="col-7 col-md-4">
                <Form.Label>username</Form.Label>
                <Form.Control
                  placeholder="Enter username"
                  type="text"
                  value={username}
                  name="Username"
                  required
                  onChange={({ target }) => setUsername(target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  username is required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="loginPassword" className="col-7 col-md-4">
                <Form.Label>password</Form.Label>
                <Form.Control
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  name="Password"
                  required
                  onChange={({ target }) => setPassword(target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  password is required
                </Form.Control.Feedback>
              </Form.Group>
              <Col className="col-12 col-sm-2 mt-2 align-self-end">
                <Button id="loginSubmit" variant="primary" type="submit">
                  login
                </Button>
              </Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
export { LoginForm };
