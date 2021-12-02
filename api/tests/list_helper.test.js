const listHelper = require('../utils/list_helper');
const blogs = require('./blogs.json');

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });
  test('of single item equals that item', () => {
    const testBlogs = blogs.slice(0, 1);
    expect(listHelper.totalLikes(testBlogs)).toBe(testBlogs[0].likes);
  });
  test('of big list is calculated correctly', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });
});

describe('favoriteBlog', () => {
  test('empty list returns null', () => {
    expect(listHelper.favoriteBlog(null)).toBe(null);
  });
  test('test list returns dijkstra article', () => {
    const expectedAnswer = blogs.find(blog => blog.title === 'Canonical string reduction');
    expect(listHelper.favoriteBlog(blogs)).toEqual(expectedAnswer);
  });
});

describe('authorBlogCount', () => {
  test('empty list returns null', () => {
    expect(listHelper.authorBlogCount(null)).toBe(null);
  });
  const authorList = listHelper.authorBlogCount(blogs);
  test('author list has three entries', () => {
    expect(authorList.length).toEqual(3);
  });
  test('Michael Chan has one blog', () => {
    expect(authorList.find(entry => entry.author === 'Michael Chan').blogs).toEqual(1);
  });
  test('Edsger W. Dijkstra has 2 blogs', () => {
    expect(authorList.find(entry => entry.author === 'Edsger W. Dijkstra').blogs).toEqual(2);
  });
  test('Robert C. Martin has 3 blogs', () => {
    expect(authorList.find(entry => entry.author === 'Robert C. Martin').blogs).toEqual(3);
  });
});

describe('mostBlogs', () => {
  test('empty list returns null', () => {
    expect(listHelper.authorBlogCount(null)).toBe(null);
  });
  test('author with most blogs is Robert C. Martin', () => {
    const authorWithMostBlogs = listHelper.mostBlogs(blogs);
    expect(authorWithMostBlogs.author).toEqual('Robert C. Martin');
  });
  test('author with most blogs has three blogs.', () => {
    const authorWithMostBlogs = listHelper.mostBlogs(blogs);
    expect(authorWithMostBlogs.blogs).toEqual(3);
  });
});

describe('authorLikeCount', () => {
  test('empty list returns null', () => {
    expect(listHelper.authorBlogCount(null)).toBe(null);
  });
  const authorList = listHelper.authorLikeCount(blogs);
  test('author list has three entries', () => {
    expect(authorList.length).toEqual(3);
  });
  test('Michael Chan has 7 likes', () => {
    expect(authorList.find(entry => entry.author === 'Michael Chan').likes).toEqual(7);
  });
  test('Edsger W. Dijkstra has 17 likes', () => {
    expect(authorList.find(entry => entry.author === 'Edsger W. Dijkstra').likes).toEqual(17);
  });
  test('Robert C. Martin has 12 likes', () => {
    expect(authorList.find(entry => entry.author === 'Robert C. Martin').likes).toEqual(12);
  });
});

describe('mostLikes', () => {
  test('empty list returns null', () => {
    expect(listHelper.authorBlogCount(null)).toBe(null);
  });
  const authorWithMostBlogs = listHelper.mostLikes(blogs);
  test('author with most likes is Edsger W. Dijkstra', () => {
    expect(authorWithMostBlogs.author).toEqual('Edsger W. Dijkstra');
  });
  test('author with most likes has 17 likes.', () => {
    expect(authorWithMostBlogs.likes).toEqual(17);
  });
});

