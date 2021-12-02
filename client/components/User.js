import React from 'react';
import {
  Container,
  Card,
  Stack,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const User = () => {
  const users = useSelector((state) => state.users);
  const id = useParams().id;
  const routerNavigate = useNavigate();
  const navigate = (event, destination) => {
    event.preventDefault();
    routerNavigate(destination);
  };

  const user = users.find((u) => u.id === id);
  const currentUser = useSelector((state) => state.currentUser);
  return user ? (
    <Container fluid>
      <Card className="border mt-3 rounded-3 border-primary">
        <Card.Header
          id="blog-header"
          className="d-flex justify-content-between fs-5 mw-100 text-primary"
          style={{ backgroundColor: '#e7f1ff' }}
        >
          {' '}
          <div id="user-name-header" className="m-1 fs-5 text-primary">
            <span>
              <i className="m-2 bi bi-person"></i>
            </span>
            <span className="">{user.name}</span>
          </div>
          <div className="fs-5 ms-auto">
            &nbsp;
            <OverlayTrigger
              key="return"
              placement="auto"
              overlay={<Tooltip id="return">return to user list</Tooltip>}
            >
              <i
                id="return-to-userlist-button"
                className="bi text-primary bi-people fs-5"
                style={{ cursor: 'pointer' }}
                onClick={(e) => navigate(e, '/users')}
              ></i>
            </OverlayTrigger>
          </div>
        </Card.Header>
        <Card.Body id="user-detail-body">
          <Stack
            id={user.id}
            className="user-detail ms-5 mb-2 p-1"
            direction="vertical"
            gap={2}
          >
            <div className="username">
              <strong>username</strong> <span>{user.username}</span>
            </div>
            {user.blogs.length === 0 ? (
              <div className="">( no blogs added )</div>
            ) : (
              <div className="">
                <strong>blogs added</strong>
              </div>
            )}
            {user.blogs.map((blog) => (
              <div key={blog.id}>
                <a
                  className="fs-6 ms-4"
                  href={`/blog/${blog.id}`}
                  onClick={(e) => navigate(e, `/blog/${blog.id}`)}
                >
                  {blog.title}
                </a>
                <span className="ms-2">by {blog.author}</span>
              </div>
            ))}
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  ) : null;
};
User.propTypes = {
  user: PropTypes.object,
};

export { User };
