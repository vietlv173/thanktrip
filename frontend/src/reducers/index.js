import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import searchReducer from './searchReducer';
import loadingReducer from './loadingReducer';
import bookingReducer from './bookingReducer';

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  search: searchReducer,
  loading: loadingReducer,
  booking: bookingReducer,
});
