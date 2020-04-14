import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import PostScream from "../scream/PostScream";
import MyButton from "../../util/MyButton";

// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

// MUI Stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import Notifications from "@material-ui/icons/Notifications";

const Navbar = ({ authenticated, logoutUser }) => {
  return (
    <AppBar>
      <Toolbar className='nav-container'>
        {authenticated ? (
          <Fragment>
            <PostScream />
            <Link to='/'>
              <MyButton tip='Home'>
                <HomeIcon />
              </MyButton>
            </Link>
            <MyButton tip='Notifications'>
              <Notifications />
            </MyButton>
          </Fragment>
        ) : (
          <Fragment>
            <Button color='inherit' component={Link} to='/login'>
              Login
            </Button>
            <Button color='inherit' component={Link} to='/'>
              Home
            </Button>
            <Button color='inherit' component={Link} to='/signup'>
              Signup
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});

const mapActionsToProps = {
  logoutUser
};

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
