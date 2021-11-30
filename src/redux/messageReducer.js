export const clearMessageAction = () => {
  return { type: 'message/delete' };
};

export const showSuccessMessageAction = ( message) => {
  return { type: 'message/add', payload: { messageType: 'success', body: message } };
};

export const showInfoMessageAction = ( message) => {
  return { type: 'message/add', payload: { messageType: 'info', body: message } };
};

export const showWarningMessageAction = ( message) => {
  return { type: 'message/add', payload: { messageType: 'warning', body: message } };
};

export const showErrorMessageAction = ( message) => {
  return { type: 'message/add', payload: { messageType: 'danger', body: message } };
};

const reducer = (state = { messageType: '', body: '' }, action) => {
  switch (action.type) {
    case 'message/add':
      return { ...action.payload };
    case 'message/delete':
      return { messageType: '', body: '' };
    default:
      return state;
  }
};

export default reducer;