import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessageAction } from '../redux/messageReducer';

export const Message = () => {
  const message = useSelector(state => state.message);
  const dispatch = useDispatch();
  const clearMessage = () => {
    dispatch(clearMessageAction());
  };

  const imageName = message.messageType === 'danger' ? 'exclamation' :
    message.messageType === 'warning' ? 'question' :
      'check';
  const iconClass = `fs-5 bi bi-${imageName}-lg`;
  const icon = <i className={iconClass}></i>;

  const title = message.messageType === 'danger' ? 'o no!' :
    message.messageType === 'warning' ? 'hmm..' :
      message.messageType === 'info' ? 'ok' :
        'yay!';

  return (
    message.body ?
      <ToastContainer position="top-end" className="m-4 zindex-modal" >
        <Toast id="toast" onClose={() => clearMessage()} delay={2000} autohide >
          <Toast.Header id="toast-header" className={`bg-${message.messageType} text-white`}>
            {icon}
            <span id="toast-title" className="me-auto font-weight-bold">
              {title}
            </span>
          </Toast.Header>
          <Toast.Body id="toast-body" className={`text-${message.messageType}`}>
            {message.body}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      : null
  );
};
