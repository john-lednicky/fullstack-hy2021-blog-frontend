import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Blog } from './Blog';

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <Container fluid>
      <Card className="border rounded-3 border-primary">
        <Card.Header style={{ backgroundColor: '#e7f1ff' }}>
          <div id="blog-list-header" className="m-1 fs-5 text-primary">
            <span>
              <i className="m-2 bi bi-files"></i>
            </span>
            <span className="">blog list</span>
          </div>
        </Card.Header>
        <Card.Body id="blog-list-body">
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <div key={blog.id}>
                <span className="blog-likes d-none">{blog.likes}</span>
                <a className="fs-5" href={`/blog/${blog.id}`}>
                  {blog.title}
                </a>
                <span className="ms-2">by {blog.author}</span>
              </div>
            ))}
        </Card.Body>
      </Card>
    </Container>
  );
};
BlogList.propTypes = {
  user: PropTypes.object,
};

export { BlogList };
