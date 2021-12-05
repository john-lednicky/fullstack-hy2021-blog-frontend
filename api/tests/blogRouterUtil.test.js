const {
  commentDifferences,
  canUserMakeRequestedCommentUpdates,
  commentDeletions,
} = require('../controllers/blogRouterUtil');

/*
  If there are changes to a comment and the current user is not
  the author of the blog entry or the comment, 
  forbid the action.
*/
describe('Detecting comment changes', () => {
  test('identical arrays have no diffs', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);

    expect(result.length).toBe(0);

    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);
  });
  test('arrays with only date differences have no diffs', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2020-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2020-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2020-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);
    expect(result.length).toBe(0);
    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);    
  });
  test('empty arrays have no diffs', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);
    expect(result.length).toBe(0);
    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);
  });

  test('changed author is a diff allowed for blog author', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.two',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);
    expect(result.length).toBe(1);
    expect(result[0].user).toBe('user.two');
    
    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);  
  });
  test('changed comment is a diff allowed for blog author', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user two',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);

    expect(result.length).toBe(1);
    expect(result[0].comment).toBe('Comment 1 by user two');
    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);  

  });
  test('changed id is a diff allowed for blog author', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user one',
          user: 'user.one',
          _id: '1:change',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);

    expect(result.length).toBe(1);
    expect(result[0]._id).toBe('1:change');
    const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
    expect(permission).toBe(true);  
  });
  test('changed comment is a diff allowed for comment author', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user two',
          user: 'user.two',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user two -- edited',
          user: 'user.two',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);

    expect(result.length).toBe(1);
    expect(result[0].comment).toBe('Comment 1 by user two -- edited');
    const permission = canUserMakeRequestedCommentUpdates('user.two', blog1, blog2);
    expect(permission).toBe(true);  
  });
  test('changed comment is a diff not allowed for a third user', () => {
    const blog1 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user two',
          user: 'user.two',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };
    const blog2 = {
      user: {
        id: 'user.one',
      },
      comments: [
        {
          comment: 'Comment 1 by user two -- edited',
          user: 'user.two',
          _id: '1:1',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 2 by user one',
          user: 'user.one',
          _id: '1:2',
          createDate: '2021-12-04T18:15:48.720Z',
        },
        {
          comment: 'Comment 3 by user one',
          user: 'user.one',
          _id: '1:3',
          createDate: '2021-12-04T18:15:48.720Z',
        },
      ],
    };

    const result = commentDifferences(blog1.comments, blog2.comments);

    expect(result.length).toBe(1);
    expect(result[0].comment).toBe('Comment 1 by user two -- edited');
    const permission = canUserMakeRequestedCommentUpdates('user.three', blog1, blog2);
    expect(permission).toBe(false);  
  });    
});

/*
  If a comment is deleted and the current user is not 
  the author of the blog entry or the comment, 
  forbid the action.
 */
  describe('Detecting comment deletions', () => {
    test('identical arrays have no deletions', () => {
      const blog1 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 1 by user one',
            user: 'user.one',
            _id: '1:1',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
      const blog2 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 1 by user one',
            user: 'user.one',
            _id: '1:1',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
  
      const result = commentDeletions(blog1.comments, blog2.comments);
  
      expect(result.length).toBe(0);
  
      const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
      expect(permission).toBe(true);
    });
    test('empty arrays have no deletions', () => {
      const blog1 = {
        user: {
          id: 'user.one',
        },
        comments: [],
      };
      const blog2 = {
        user: {
          id: 'user.one',
        },
        comments: [],
      };
  
      const result = commentDeletions(blog1.comments, blog2.comments);
      expect(result.length).toBe(0);
      const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
      expect(permission).toBe(true);
    });
  
    test('deleted comment allowed for blog author', () => {
      const blog1 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 1 by user one',
            user: 'user.one',
            _id: '1:1',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
      const blog2 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
  
      const result = commentDeletions(blog1.comments, blog2.comments);
      expect(result.length).toBe(1);
      expect(result[0].comment).toBe('Comment 1 by user one');
      
      const permission = canUserMakeRequestedCommentUpdates('user.one', blog1, blog2);
      expect(permission).toBe(true);  
    });
    test('deleted comment is a diff allowed for comment author', () => {
      const blog1 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 1 by user two',
            user: 'user.two',
            _id: '1:1',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
      const blog2 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
  
      const result = commentDeletions(blog1.comments, blog2.comments);
  
      expect(result.length).toBe(1);
      expect(result[0].comment).toBe('Comment 1 by user two');
      const permission = canUserMakeRequestedCommentUpdates('user.two', blog1, blog2);
      expect(permission).toBe(true);  
    });
    test('deleted comment is a diff not allowed for a third user', () => {
      const blog1 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 1 by user two',
            user: 'user.two',
            _id: '1:1',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
      const blog2 = {
        user: {
          id: 'user.one',
        },
        comments: [
          {
            comment: 'Comment 2 by user one',
            user: 'user.one',
            _id: '1:2',
            createDate: '2021-12-04T18:15:48.720Z',
          },
          {
            comment: 'Comment 3 by user one',
            user: 'user.one',
            _id: '1:3',
            createDate: '2021-12-04T18:15:48.720Z',
          },
        ],
      };
  
      const result = commentDeletions(blog1.comments, blog2.comments);
  
      expect(result.length).toBe(1);
      expect(result[0].comment).toBe('Comment 1 by user two');
      const permission = canUserMakeRequestedCommentUpdates('user.three', blog1, blog2);
      expect(permission).toBe(false);  
    });    
  });