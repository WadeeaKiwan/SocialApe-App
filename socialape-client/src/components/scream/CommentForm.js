import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.styles
});

const CommentForm = ({
  classes,
  screamId,
  UI: { loading, errors },
  authenticated,
  submitComment
}) => {
  const [body, setBody] = useState("");
  const [errorsData, setErrorsData] = useState({});

  useEffect(() => {
    if (errors) {
      setErrorsData(errors);
    }
    if (!errors && !loading) {
      setBody("");
      setErrorsData({});
    }
  }, [errors, loading]);

  const handleChange = event => {
    setBody(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    submitComment(screamId, { body });
  };

  return (authenticated ? (
    <Grid item sm={12} style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <TextField name="body" type="text" label="Comment on Scream" error={errorsData.comment ? true : false} helperText={errorsData.comment} value={body} onChange={handleChange} fullWidth className={classes.textField} />
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
          Submit
        </Button>
      </form>
      <hr className={classes.visibleSeparator} />
    </Grid>
  ) : null);
};

CommentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  screamId: PropTypes.string.isRequired,
  submitComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

const mapActionsToProps = {
  submitComment
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentForm));
