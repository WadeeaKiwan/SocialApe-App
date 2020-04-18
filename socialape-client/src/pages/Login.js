import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppIcon from "../images/icon.png";
import { Link } from "react-router-dom";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux Stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.styles
});

const Login = ({ classes, history, UI: { loading, errors }, loginUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorsData, setErrorsData] = useState({});

  const { email, password } = formData;

  useEffect(() => {
    if (errors) {
      setErrorsData(errors);
    }
  }, [errors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(formData, history);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt='monkey' className={classes.image} />
        <Typography variant='h2' className={classes.pageTitle}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id='email'
            name='email'
            type='email'
            label='Email'
            className={classes.textField}
            helperText={errorsData.email}
            error={errorsData.email ? true : false}
            value={email}
            onChange={handleChange}
            fullWidth
          ></TextField>
          <TextField
            id='password'
            name='password'
            type='password'
            label='Password'
            className={classes.textField}
            helperText={errorsData.password}
            error={errorsData.password ? true : false}
            value={password}
            onChange={handleChange}
            fullWidth
          ></TextField>
          {errorsData.general && (
            <Typography variant='body2' className={classes.customError}>
              {errorsData.general}
            </Typography>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
            disabled={loading}
          >
            Login
            {loading && <CircularProgress size={30} className={classes.progress} />}
          </Button>
          <br />
          <small>
            Don't have an account ? Sign up <Link to='/signup'>here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));
