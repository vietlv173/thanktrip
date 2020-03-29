import history from '../history'

export const bookingAction = (dispatch, params) => {
  dispatch({
    type: 'START_BOOKING',
    payload: params
  });

  history.push('/booking');
};
