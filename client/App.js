import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';

import { Route, Routes } from 'react-router-dom';

import { initializeBlogs } from './redux/blogReducer';
import { initializeUsers } from './redux/userReducer';
import { BlogList } from './components/BlogList';
import { Blog } from './components/Blog';
import { BlogForm } from './components/BlogForm';
import { UserList } from './components/UserList';
import { User } from './components/User';
import { Navigation } from './components/Navigation';

import { LoginForm, LogoutForm } from './components/Login';
import { createLoginAction } from './redux/loginReducer';

import { Message } from './components/Message';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    const authenticatedBlogUser = window.localStorage.getItem(
      'authenticatedBlogUser'
    );
    if (authenticatedBlogUser) {
      const currentUser = JSON.parse(authenticatedBlogUser);
      dispatch(createLoginAction(currentUser));
    }
  }, [dispatch]);

  return (
    <div>
      {currentUser === null ? (
        <>
          <LoginForm />
          <Routes>
            <Route path="/blog/:id" element={<Blog />} />
            <Route
              path="/"
              element={
                <>
                  <BlogList />
                </>
              }
            />
          </Routes>
          <Message />
        </>
      ) : (
        <>
          <Navigation />
          <Routes>
            <Route path="/users" element={<UserList />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route
              path="/"
              element={
                <>
                  <BlogForm />
                  <BlogList />
                </>
              }
            />
          </Routes>
          <Message />
        </>
      )}
    </div>
  );
};

export default App;
