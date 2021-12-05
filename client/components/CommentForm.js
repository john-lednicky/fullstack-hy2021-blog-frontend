import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  showSuccessMessageAction,
  showErrorMessageAction,
} from '../redux/messageReducer';
import { addBlogComment } from '../redux/blogReducer';

const CommentForm = ({ blog }) => {
  const currentUser = useSelector((state) => state.currentUser);

  const [blogComment, setBlogComment] = useState('');
  const [validated, setValidated] = useState(false);
  const [reload, setReload] = useState(0);

  const handleReset = async (event) => {
    event.preventDefault();
    setValidated(false);
    setBlogComment('');
  };

  const dispatch = useDispatch();
  const showSuccessMessage = (message) => {
    dispatch(showSuccessMessageAction(message));
  };
  const showErrorMessage = (message) => {
    dispatch(showErrorMessageAction(message));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      try {
        await dispatch(addBlogComment(currentUser, blogComment, blog));
        showSuccessMessage('Comment Added.');

        setBlogComment('');
      } catch (err) {
        console.error(err);
        showErrorMessage('Unable to add comment. See console for details.');
      }
    }
  };

  return (
    <Form
      noValidate
      validated={validated}
      id="comment-form"
      autoComplete="off"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <div className="">
        <Row className="">
          <Form.Group
            as={Col}
            controlId="blog-comment"
            className="col-7 col-md-4"
          >
            <Form.Label className="fw-bold">Add Comment</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter comment"
              type="text"
              value={blogComment}
              name="blog-comment"
              required
              minLength="5"
              maxLength="200"
              pattern="^[\w \.\-':,]+$"
              aria-describedby="commentHelpBlock"
              onChange={({ target }) => setBlogComment(target.value)}
            />
            <Form.Control.Feedback>comment looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              comment is required and must be from 5 to 100 characters long,
              including numbers, letters, spaces, periods, commas, colons,
              hyphens, and apostrophes
            </Form.Control.Feedback>
            <Form.Text id="commentHelpBlock" muted>
            </Form.Text>
          </Form.Group>

          <Col className="col-12 col-sm-4 mt-2 align-self-end">
            <Button
              id="comment-form-submit"
              type="submit"
              className="btn btn-primary"
            >
              save
            </Button>
            <Button
              id="comment-form-reset"
              type="reset"
              className="ms-2 btn btn-primary"
            >
              cancel
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};
CommentForm.propTypes = {
  blog: PropTypes.object,
};
export { CommentForm };
