import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import Navbar from "../components/Navbar";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <div>
          <Navbar />
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.id
});

export default connect(mapStateToProps)(PrivateRoute);
