import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import messageReducer from './messageReducer';
import blogReducer from './blogReducer';
import userReducer from './userReducer';
import loginReducer from './loginReducer';

const reducer = combineReducers({
  message: messageReducer,
  blogs: blogReducer,
  users: userReducer,
  currentUser: loginReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

export default store;