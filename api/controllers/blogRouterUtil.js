const User = require('../models/userModel');

const removeBlogFromUser = async (blogId, userId) => {
  const userToUpdate = await User.findById(userId);
  if (userToUpdate) {
    let newBlogs;
    if (userToUpdate.blogs) {
      newBlogs = userToUpdate.blogs.filter(
        (userblog) => userblog.toString() !== blogId.toString()
      );
      await User.findOneAndUpdate(
        { _id: userToUpdate.id },
        { blogs: newBlogs }
      );
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

const canUserMakeRequestedCommentUpdates = (
  currentUserId,
  existingBlog,
  requestedBlog
) => {
  /*
  If there are changes to a comment or a comment is deleted
  and the current user is not the author of the blog entry 
  or the comment 
  forbid the action.
  */

  if (existingBlog.user.toString() === currentUserId) {
    return true;
  }

  const changedComments = commentDifferences(
    existingBlog.comments,
    requestedBlog.comments
  );
  console.log('changedComments',changedComments);

  const deletedComments = commentDeletions(
    existingBlog.comments,
    requestedBlog.comments
  );
  if (
    !changedComments.some((c) => c.user.toString() !== currentUserId) &&
    !deletedComments.some((c) => c.user.toString() !== currentUserId)
  ) {
    return true;
  }

  return false;
};
const commentDifferences = (existingComments, newComments) => {
  return newComments.filter(
    (newComment) =>
      !existingComments.some(
        (existingComment) =>
          newComment._id === existingComment._id.toString() 
          && newComment.comment === existingComment.comment 
      )
  );
};
const commentDeletions = (existingComments, newComments) => {
  return existingComments.filter(
    (existingComment) =>
      !newComments.some((newComment) => newComment._id.toString() === existingComment._id.toString())
  );
};

module.exports = {
  removeBlogFromUser,
  addBlogIdToUser,
  commentDifferences,
  commentDeletions,
  canUserMakeRequestedCommentUpdates,
};
