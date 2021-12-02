// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = blogs => {
  let returnValue = null;
  if (Array.isArray(blogs)) {
    blogs.forEach(blog => {
      if (!returnValue || blog.likes > returnValue.likes) {
        returnValue = blog;
      }
    });
  }

  return returnValue;
};

const authorBlogCount = blogs => {
  let returnValue = null;
  if (Array.isArray(blogs)) {
    returnValue = blogs.reduce((output, blog) => {
      const authorEntry = output.find(entry => entry.author === blog.author);
      if (authorEntry) {
        authorEntry.blogs += 1;
        return output.filter(blog => blog.author !== authorEntry.author).concat(authorEntry);
      } else {
        return output.concat({ author: blog.author, blogs: 1 });
      }
    }, []);
  }

  return returnValue;
};

const mostBlogs = blogs => authorBlogCount(blogs).sort((a, b) => a.blogs < b.blogs ? 1 : -1)[0];

const authorLikeCount = blogs => {
  let returnValue = null;
  if (Array.isArray(blogs)) {
    returnValue = blogs.reduce((output, blog) => {
      const authorEntry = output.find(entry => entry.author === blog.author);
      if (authorEntry) {
        authorEntry.likes += blog.likes;
        return output.filter(blog => blog.author !== authorEntry.author).concat(authorEntry);
      } else {
        return output.concat({ author: blog.author, likes: blog.likes });
      }
    }, []);
  }

  return returnValue;
};

const mostLikes = blogs => authorLikeCount(blogs).sort((a, b) => a.likes < b.likes ? 1 : -1)[0];

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorBlogCount,
  mostBlogs,
  authorLikeCount,
  mostLikes,
};
