import userService from '../services/userService';

export const createInitAction = (users) => {
  const returnValue = {
    type: 'users/init',
    payload: users,
  };
  return returnValue;
};
export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(createInitAction(users));
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'users/init':
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
