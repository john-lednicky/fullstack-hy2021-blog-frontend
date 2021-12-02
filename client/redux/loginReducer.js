import loginService from '../services/loginService';

const createLogoutAction = () => {
  const returnValue = {
    type: 'logout',
    payload: null,
  };
  return returnValue;
};
export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('authenticatedBlogUser');
    dispatch(createLogoutAction());
  };
};

export const createLoginAction = (user) => {
  const returnValue = {
    type: 'login',
    payload: user,
  };
  return returnValue;
};
export const login = (username, password) => {
  return async (dispatch) => {
    const loggedInUser = await loginService.login(username, password);
    window.localStorage.setItem(
      'authenticatedBlogUser',
      JSON.stringify(loggedInUser)
    );
    dispatch(createLoginAction(loggedInUser));
  };
};

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'login':
      return action.payload;
    case 'logout':
      return null;
    default:
      return state;
  }
};

export default reducer;
