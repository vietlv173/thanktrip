import React from "react";
import { Provider } from "react-redux";
import jwt_decode from 'jwt-decode';

import AppRouter from "./routers/AppRouter";
import store from "./store";
import setAuthToken from "./helpers/setAuthToken";
import { setCurrentUser, logoutUser } from './actions/authentication';

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);

  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}

const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default App;
