import blogService from '../services/blogService';

const createRemoveAction = (blog) => {
  const returnValue = {
    type: 'blog/remove',
    payload: blog.id,
  };
  return returnValue;
};
export const removeBlog = (user, blog) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.remove(user, blog);
    dispatch(createRemoveAction(blog));
  };
};

const createAddAction = (blog) => {
  const returnValue = {
    type: 'blog/add',
    payload: blog,
  };
  return returnValue;
};
export const addBlog = (user, author, title, url) => {
  return async dispatch => {
    const newBlog = await blogService.add(user, author, title, url);
    newBlog.user = user;
    dispatch(createAddAction(newBlog));
  };
};

const createModifyAction = (blog) => {
  const returnValue = {
    type: 'blog/modify',
    payload: blog,
  };
  return returnValue;
};
export const likeBlog = (user, blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.like(user, blog);
    dispatch(createModifyAction(updatedBlog));
  };
};

export const createInitAction = (blogs) => {
  const returnValue = {
    type: 'blog/init',
    payload: blogs,
  };
  return returnValue;
};
export const initializeBlogs = () => {
  return async (dispatch) => {
    const anecdotes = await blogService.getAll();
    dispatch(createInitAction(anecdotes));
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'blog/modify':
      return state.map((a) =>
        a.id !== action.payload.id ? a : action.payload
      );
    case 'blog/add':
      return state.concat(action.payload);
    case 'blog/remove':
      return state.filter((b) => b.id !== action.payload);
    case 'blog/init':
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
