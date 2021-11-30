import React from 'react';
import {
  Navbar,
  Nav,
  Container,
  Stack,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  showSuccessMessageAction,
  showErrorMessageAction,
} from '../redux/messageReducer';
import { login, logout } from '../redux/loginReducer';

const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const showSuccessMessage = (message) => {
    dispatch(showSuccessMessageAction(message));
  };
  const showErrorMessage = (message) => {
    dispatch(showErrorMessageAction(message));
  };

  const handleLogout = () => {
    const username = currentUser.name;
    try {
      dispatch(logout());
      showSuccessMessage(`logged out ${username}`);
    } catch (err) {
      console.error(err);
      showErrorMessage(`problem logging out ${username}`);
    }
  };
  return (
    <>
      <Navbar
        className="m-3 border rounded-3 border-primary"
        collapseOnSelect
        sticky="top"
        expand="sm"
        bg="primary"
        variant="dark"
      >
        <Container fluid className="m-1">
          <Navbar.Brand href="/">HY Bloglist</Navbar.Brand>
          <Navbar.Toggle aria-controls="blogs-nav" />
          <Navbar.Collapse id="blogs-nav">
            <Nav>
              <Nav.Link href="/">Blogs</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
            </Nav>
            <div className="fs-5 ms-auto">
              &nbsp;
              <OverlayTrigger
                key="left"
                placement="auto"
                overlay={
                  <Tooltip id="left">
                    Logout {currentUser.name.toLowerCase()}
                  </Tooltip>
                }
              >
                <i
                  id="logout-button"
                  className="bi text-light bi-box-arrow-right fs-4"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleLogout(null)}
                ></i>
              </OverlayTrigger>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export { Navigation };
