import React from 'react';
import { Container, Card, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const users = useSelector((state) => state.users);
  const routerNavigate = useNavigate();
  const navigate = (event, destination) => {
    event.preventDefault();
    routerNavigate(destination);
  };

  return (
    <Container fluid>
      <Card className="border mt-3 rounded-3 border-primary">
        <Card.Header style={{ backgroundColor: '#e7f1ff' }}>
          <div id="user-list-header" className="m-1 fs-5 text-primary">
            <span>
              <i className="m-2 bi bi-people"></i>
            </span>
            <span className="">user list</span>
          </div>
        </Card.Header>
        <Card.Body id="user-list-body">
          <Stack
            className="user-list ms-5 mb-2 p-1"
            direction="vertical"
            gap={2}
          >
            {users
              .sort((a, b) => a.name - b.name)
              .map((user) => (
                <div key={user.id}>
                  <a
                    className="fs-5"
                    href={`/user/${user.id}`}
                    onClick={(e) => navigate(e, `/user/${user.id}`)}
                  >
                    {user.name}
                  </a>
                  <span className="ms-2">
                    ( {user.blogs.length} blog
                    {user.blogs.length !== 1 ? 's' : ''} created )
                  </span>
                </div>
              ))}
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  );
};

export { UserList };
