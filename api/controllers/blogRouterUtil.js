const User = require('../models/userModel');

const removeBlogFromUser = async (blogId, userId) => {
  const userToUpdate = await User.findById(userId);
  if (userToUpdate) {
    let newBlogs;
    if (userToUpdate.blogs) {
      newBlogs = userToUpdate.blogs.filter(userblog => userblog.toString() !== blogId.toString());
      await User.findOneAndUpdate({ _id: userToUpdate.id }, { blogs: newBlogs });
    }
  }
};

const addBlogIdToUser = async (blogIdObject, userId) => {
  const userToUpdate = await User.findById(userId);
  if (userToUpdate) {
    let newBlogs;
    if (userToUpdate.blogs) {
      newBlogs = userToUpdate.blogs.concat(blogIdObject);
    } else {
      newBlogs = [blogIdObject];
    }
    await User.findOneAndUpdate({ _id: userToUpdate.id }, { blogs: newBlogs });
  }
};

module.exports = { removeBlogFromUser, addBlogIdToUser };
