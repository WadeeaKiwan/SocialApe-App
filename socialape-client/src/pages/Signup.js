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
import { signupUser } from "../redux/actions/userActions";

const styles = theme => ({
  ...theme.styles
});

const Signup = ({ classes, history, UI: { loading, errors }, signupUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: ""
  });
  const [errorsData, setErrorsData] = useState({});

  const { email, password, confirmPassword, handle } = formData;

  useEffect(() => {
    if (errors) {
      setErrorsData(errors);
    }
  }, [errors]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    signupUser(formData, history);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt='monkey' className={classes.image} />
        <Typography variant='h2' className={classes.pageTitle}>
          Signup
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
          <TextField
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            label='Confirm Password'
            className={classes.textField}
            helperText={errorsData.confirmPassword}
            error={errorsData.confirmPassword ? true : false}
            value={confirmPassword}
            onChange={handleChange}
            fullWidth
          ></TextField>
          <TextField
            id='handle'
            name='handle'
            type='text'
            label='Handle'
            className={classes.textField}
            helperText={errorsData.handle}
            error={errorsData.handle ? true : false}
            value={handle}
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
            Signup
            {loading && <CircularProgress size={30} className={classes.progress} />}
          </Button>
          <br />
          <small>
            Already have an account ? Login <Link to='/login'>here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  signupUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Signup));
