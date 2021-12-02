import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const add = async (user, author, title, url) => {
  const blogToAdd = { author, title, url };
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  const response = await axios.post(baseUrl, blogToAdd, config);
  return response.data;
};

const remove = async (user, blog) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  await axios.delete(`${baseUrl}/${blog.id}`, config);
};

const like = async (user, blog) => {
  const blogToUpdate = {
    likes: blog.likes + 1,
  };
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  const response = await axios.put(
    `${baseUrl}/${blog.id}`,
    blogToUpdate,
    config
  );
  return { ...response.data, user: blog.user };
};

const blogService = {
  getAll,
  add,
  remove,
  like,
};
export default blogService;
