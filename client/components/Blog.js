import React, { useState } from 'react';
import {
  Container,
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
  Stack,
  Collapse,
  Modal,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  showSuccessMessageAction,
  showErrorMessageAction,
} from '../redux/messageReducer';
import { likeBlog, removeBlog } from '../redux/blogReducer';

const Blog = () => {
  const blogs = useSelector((state) => state.blogs);
  const id = useParams().id;
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.id === id);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  const showSuccessMessage = (message) => {
    dispatch(showSuccessMessageAction(message));
  };
  const showErrorMessage = (message) => {
    dispatch(showErrorMessageAction(message));
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const likeBlogHandler = async (event) => {
    event.preventDefault();
    if (currentUser) {
      try {
        await dispatch(likeBlog(currentUser, blog));
        showSuccessMessage('Blog liked!');
      } catch (err) {
        console.error(err);
        showErrorMessage('Something went wrong...');
      }
    }
  };

  const deleteBlogHandler = (event) => {
    event.preventDefault();
    setShowDeleteConfirm(true);
  };

  const deleteBlogConfirmHandler = async (event) => {
    event.preventDefault();
    if (currentUser) {
      try {
        setShowDeleteConfirm(false);
        await dispatch(removeBlog(currentUser, blog));
        navigate('/');
        showSuccessMessage('Blog deleted!');
      } catch (err) {
        setShowDeleteConfirm(false);
        console.error(err);
        showErrorMessage('Something went wrong...');
      }
    }
  };

  return blog ? (
    <Container fluid>
      <Card className="border mt-3 rounded-3 border-primary">
        <Card.Header
          id="blog-header"
          className="d-flex justify-content-between fs-5 mw-100 text-primary"
          style={{ backgroundColor: '#e7f1ff' }}
        >
          <div>
            <span>
              <i className="m-2 bi bi-file-earmark-text"></i>
            </span>
            <span className="">
              {blog.title}, by {blog.author}
            </span>
          </div>
          <div className="fs-5 ms-auto">
            &nbsp;
            <OverlayTrigger
              key="return"
              placement="auto"
              overlay={<Tooltip id="return">return to blog list</Tooltip>}
            >
              <i
                id="return-to-bloglist-button"
                className="bi text-primary bi-files fs-5"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              ></i>
            </OverlayTrigger>
          </div>
          <Modal
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
            <Modal.Footer>
              <Button
                id="cancel-delete-blog"
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                id="confirm-delete-blog"
                variant="primary"
                onClick={deleteBlogConfirmHandler}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Header>
        <Card.Body id="blog-body">
          <Stack
            id={`blog-detail-${blog.id}`}
            className="blog-detail ms-5 mb-2 p-1"
          >
            <div>
              <a href={blog.url} target="blog-article" className="blog-url">
                {blog.url}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>opens in new window</Tooltip>}
                >
                  <i className="ms-2 text-dark bi bi-box-arrow-up-right"></i>
                </OverlayTrigger>
              </a>
            </div>
            <div id={`blog-likes-${blog.id}`} className="blog-likes fs-4">
              <span
                id={`blog-like-count-${blog.id}`}
                className="blog-like-count fs-5 me-1 align-text-top"
                style={{ color: '#F433FF' }}
              >{`(${blog.likes})`}</span>
              <span id={`blog-hearts-${blog.id}`} className="blog-hearts">
                {[...Array(blog.likes)].map((el, i) => (
                  <i
                    id={`blog-heart-${blog.id}-${i}`}
                    key={`blog-heart-${i}-${blog.id}`}
                    style={{ color: '#F433FF' }}
                    className="blog-heart me-1 bi bi-heart-fill"
                  ></i>
                ))}
              </span>
              {currentUser && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>like this blog</Tooltip>}
                >
                  <i
                    id={`like-this-blog-${blog.id}`}
                    role="button"
                    style={{ color: '#F433FF' }}
                    className="like-this-blog ms-2 bi bi-heart"
                    onClick={likeBlogHandler}
                  ></i>
                </OverlayTrigger>
              )}
            </div>
            {currentUser && currentUser.id === blog.user.id && (
              <div className="mt-2">
                <button
                  id={`delete-this-blog-${blog.id}`}
                  className="delete-this-blog btn btn-primary p-1"
                  onClick={deleteBlogHandler}
                >
                  delete blog
                </button>
              </div>
            )}
            <div
              id={`blog-author-${blog.id}`}
              className="blog-author fs-8 fst-italic mt-2"
            >
              <span>added by: </span>
              {currentUser && currentUser.id ? (
                <a href={`/user/${blog.user.id}`}>{blog.user.name}</a>
              ) : (
                <span>{blog.user.name}</span>
              )}
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  ) : null;
};
Blog.propTypes = {
  user: PropTypes.object,
};

export { Blog };
