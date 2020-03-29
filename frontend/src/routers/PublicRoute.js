import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

let navbar = <Navbar />;
if(window.location.pathname === "/" || window.location.pathname === "/search") {
}

const PublicRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Redirect to="/" />
      ) : (
        <div>
          {navbar}
          <Component {...props} />
          <Loading />

          <Footer />
        </div>
      )
    }
  />
);

const mapStateToProps = state => ({
  isAuthenticated: false
});

export default connect(mapStateToProps)(PublicRoute);
