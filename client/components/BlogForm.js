import React, { useState } from 'react';
import { Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  showSuccessMessageAction,
  showErrorMessageAction,
} from '../redux/messageReducer';
import { addBlog } from '../redux/blogReducer';

const BlogForm = () => {
  const currentUser = useSelector((state) => state.currentUser);

  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [validated, setValidated] = useState(false);
  const [reload, setReload] = useState(0);

  const handleBlogReset = async (event) => {
    event.preventDefault();
    setValidated(false);
    setBlogAuthor('');
    setBlogTitle('');
    setBlogUrl('');
    setReload(reload + 1);
  };

  const dispatch = useDispatch();
  const showSuccessMessage = (message) => {
    dispatch(showSuccessMessageAction(message));
  };
  const showErrorMessage = (message) => {
    dispatch(showErrorMessageAction(message));
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      try {
        await dispatch(addBlog(currentUser, blogAuthor, blogTitle, blogUrl));
        showSuccessMessage('Blog Added.');

        setBlogAuthor('');
        setBlogTitle('');
        setBlogUrl('');
        setReload(reload + 1);
      } catch (err) {
        console.error(err);
        showErrorMessage('Unable to add blog. See console for details.');
      }
    }
  };

  return (
    <Accordion className="m-2 p-1" key={reload}>
      <Accordion.Item
        eventKey="0"
        className="bg-light text-primary border rounded-3 border-primary"
      >
        <Accordion.Header>
          <div id="blog-form-header" className="fs-5 text-primary">
            <span>
              <i className="m-2 bi bi-plus-circle"></i>
            </span>
            <span>add blog</span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Form
            noValidate
            validated={validated}
            id="blog-form"
            autoComplete="off"
            onSubmit={handleBlogSubmit}
            onReset={handleBlogReset}
          >
            <Row className="">
              <Form.Group
                as={Col}
                controlId="blog-author"
                className="col-7 col-md-4"
              >
                <Form.Label>author</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="Enter author"
                  type="text"
                  value={blogAuthor}
                  name="blog-author"
                  required
                  minLength="5"
                  maxLength="100"
                  pattern="^[\w \.\-',]+$"
                  aria-describedby="authorHelpBlock"
                  onChange={({ target }) => setBlogAuthor(target.value)}
                />
                <Form.Control.Feedback>
                  author looks good!
                </Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  author is required and must be from 5 to 100 characters long,
                  including numbers, letters, spaces, periods, commas, hyphens,
                  and apostrophes
                </Form.Control.Feedback>
                <Form.Text id="authorHelpBlock" muted>
                  Please include the author&apos;s full name.
                </Form.Text>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="blog-title"
                className="col-7 col-md-4"
              >
                <Form.Label>title</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="Enter title"
                  type="text"
                  value={blogTitle}
                  name="blog-title"
                  required
                  minLength="5"
                  maxLength="100"
                  pattern="^[\w \.\-':,]+$"
                  aria-describedby="titleHelpBlock"
                  onChange={({ target }) => setBlogTitle(target.value)}
                />
                <Form.Control.Feedback>title looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  title is required and must be from 5 to 100 characters long,
                  including numbers, letters, spaces, periods, commas, colons,
                  hyphens, and apostrophes
                </Form.Control.Feedback>
                <Form.Text id="titleHelpBlock" muted>
                  Please include the full title of the blog.
                </Form.Text>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="blog-url"
                className="col-7 col-md-4"
              >
                <Form.Label>url</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="Enter url"
                  type="URL"
                  value={blogUrl}
                  name="blog-url"
                  required
                  aria-describedby="urlHelpBlock"
                  onChange={({ target }) => setBlogUrl(target.value)}
                />
                <Form.Control.Feedback>url looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  please enter a valid url
                </Form.Control.Feedback>
                <Form.Text id="urlHelpBlock" muted>
                  Please include the url of the blog beginning with https:// or
                  http://
                </Form.Text>
              </Form.Group>

              <Col className="col-12 col-sm-2 mt-2 align-self-end">
                <Button
                  id="blog-form-submit"
                  type="submit"
                  className="btn btn-primary"
                >
                  save
                </Button>
                <Button
                  id="blog-form-reset"
                  type="reset"
                  className="ms-2 btn btn-primary"
                >
                  cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export { BlogForm };
