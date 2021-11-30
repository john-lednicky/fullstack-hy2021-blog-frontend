import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, act } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import { prettyDOM, waitFor } from '@testing-library/dom';
import { Blog } from './Blog';
import { BlogForm } from './BlogForm';

import * as redux from 'react-redux';
import { Provider } from 'react-redux';
// import store from '../redux/store';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

const user = {
  username: 'adaldrida.brandybuck',
  name: 'Adaldrida Brandybuck',
  id: '618c4c1eaf2a6e044dc930fd',
  token: 'fake-token',
};

const differentUser = {
  username: 'frodo.baggins',
  name: 'Frodo Baggins',
  id: '718c4c1eaf2a6e044dc930fd',
  token: 'fake-token',
};

const blogs = [
  {
    title: 'The Joel Test: 12 Steps to Better Code',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
    likes: 5,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '618f178025aea340d54b3b52',
  },
  {
    title: 'Things You Should Never Do, Part I',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/',
    likes: 4,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '618f17a125aea340d54b3b56',
  },
  {
    title: 'The Iceberg Secret, Revealed',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2002/02/13/the-iceberg-secret-revealed/',
    likes: 7,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '618f17fd25aea340d54b3b5a',
  },
  {
    title: 'The Guerrilla Guide to Interviewing',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2006/10/25/the-guerrilla-guide-to-interviewing-version-30/',
    likes: 15,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '618f1efc25aea340d54b3b63',
  },
  {
    title: 'Fire And Motion',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2002/01/06/fire-and-motion/',
    likes: 13,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '618f1f8325aea340d54b3b67',
  },
  {
    title: 'Funky Like a Skunk',
    author: 'Betty Davis',
    url: 'http://www.io.com',
    likes: 10,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '619432fb204699aeb6ed3644',
  },
  {
    title: 'Whats Going On',
    author: 'Marvin Gaye',
    url: 'http://www.io.com',
    likes: 0,
    user: {
      username: 'adaldrida.brandybuck',
      name: 'Adaldrida Brandybuck',
      blogs: [
        '618f178025aea340d54b3b52',
        '618f17a125aea340d54b3b56',
        '618f17fd25aea340d54b3b5a',
        '618f1efc25aea340d54b3b63',
        '618f1f8325aea340d54b3b67',
        '619432fb204699aeb6ed3644',
        '61943516204699aeb6ed3666',
      ],
      id: '618c4c1eaf2a6e044dc930fd',
    },
    id: '61943516204699aeb6ed3666',
  },
];
const blog = blogs.find((b) => b.user.username === user.username);
const testBlogId = blog.id;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe('Blog entry', () => {
  const useDispatchMock = jest.spyOn(redux, 'useDispatch');
  const mockDispatch = jest.fn();
  beforeEach(() => {
    mockDispatch.mockClear();
    useDispatchMock.mockReturnValue(mockDispatch);
    store = mockStore({ currentUser: user, blogs });
  });

  test('renders blog content', () => {
    const blogComponent = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/blog/${testBlogId}`]}>
          <Routes>
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    // blogComponent.debug();
    expect(blogComponent.container).toHaveTextContent(blog.title);
    expect(blogComponent.container).toHaveTextContent(blog.author);
    expect(blogComponent.container).toHaveTextContent(blog.url);
    expect(blogComponent.container).toHaveTextContent(`(${blog.likes})`);
    const deleteButton = blogComponent.getByText('delete blog');
    expect(deleteButton).toBeTruthy();

    const hearts =
      blogComponent.container.getElementsByClassName('bi-heart-fill');
    expect(hearts.length).toBe(blog.likes);

    const emptyHearts =
      blogComponent.container.getElementsByClassName('bi-heart');
    expect(emptyHearts.length).toBe(1);
  });
  test('does not render delete button for non-owner', () => {
    store = mockStore({ currentUser: differentUser, blogs });
    const blogComponent = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/blog/${testBlogId}`]}>
          <Routes>
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    const deleteButton = blogComponent.queryByText('delete blog');
    expect(deleteButton).toBeFalsy();
  });
  test('does not render delete or like button for anonymous user', () => {
    store = mockStore({ currentUser: null, blogs });
    const blogComponent = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/blog/${testBlogId}`]}>
          <Routes>
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    const deleteButton = blogComponent.queryByText('delete blog');
    expect(deleteButton).toBeFalsy();
    const emptyHearts =
      blogComponent.container.getElementsByClassName('bi-heart');
    expect(emptyHearts.length).toBe(0);
  });
  test('like button works', async () => {
    const blogComponent = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/blog/${testBlogId}`]}>
          <Routes>
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const hearts =
      blogComponent.container.getElementsByClassName('bi-heart-fill');
    expect(hearts.length).toBe(blog.likes);

    const emptyHearts =
      blogComponent.container.getElementsByClassName('bi-heart');
    expect(emptyHearts.length).toBe(1);

    const addButton = emptyHearts[0];
    // console.log(prettyDOM(addButton));

    const heartsSpan = blogComponent.container.querySelector(
      `#blog-hearts-${blog.id}`
    );
    expect(heartsSpan.childElementCount).toBe(hearts.length);

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockDispatch.mock.calls).toHaveLength(1);
    });
  });
});

describe('Blog form', () => {
  const useDispatchMock = jest.spyOn(redux, 'useDispatch');
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    useDispatchMock.mockReturnValue(mockDispatch);
    store = mockStore({ currentUser: user });
  });

  test('renders form', () => {
    let component;
    act(() => {
      component = render(
        <Provider store={store}>
          <BlogForm />
        </Provider>
      );
    });
    // component.debug();
    expect(component.container).toHaveTextContent('add blog');
    expect(component.container).toHaveTextContent('author');
    // eslint-disable-next-line quotes
    expect(component.container).toHaveTextContent(
      // eslint-disable-next-line quotes
      "Please include the author's full name."
    );
    expect(component.container).toHaveTextContent('title');
    expect(component.container).toHaveTextContent(
      'Please include the full title of the blog.'
    );
    expect(component.container).toHaveTextContent('url');
    expect(component.container).toHaveTextContent(
      'Please include the url of the blog beginning with https:// or http://'
    );

    const authorInput = component.getByLabelText('author');
    expect(authorInput).toBeTruthy();
    const titleInput = component.getByLabelText('title');
    expect(titleInput).toBeTruthy();
    const urlInput = component.getByLabelText('url');
    expect(urlInput).toBeTruthy();
  });
  test('valid form submission', async () => {
    let component;
    act(() => {
      component = render(
        <Provider store={store}>
          <BlogForm />
        </Provider>
      );
    });
    // component.debug();
    const blogToAdd = {
      title: 'Thoughts on Good and Evil',
      author: 'Gandalf Graybeard',
      url: 'http://www.io.com',
    };

    const authorInput = component.getByLabelText('author');
    fireEvent.change(authorInput, {
      target: { value: blogToAdd.author },
    });

    const titleInput = component.getByLabelText('title');
    fireEvent.change(titleInput, {
      target: { value: blogToAdd.title },
    });

    const urlInput = component.getByLabelText('url');
    fireEvent.change(urlInput, {
      target: { value: blogToAdd.url },
    });

    const form = component.container.querySelector('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockDispatch.mock.calls).toHaveLength(2);
    });
    expect(mockDispatch.mock.calls[0][0].toString()).toContain(
      'dispatch(createAddAction(newBlog))'
    );
    expect(mockDispatch.mock.calls[1][0].type).toBe('message/add');
    expect(mockDispatch.mock.calls[1][0].payload.messageType).toBe('success');
  });
});
