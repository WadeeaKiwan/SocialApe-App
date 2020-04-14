import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import MyButton from "../util/MyButton";

// Redux
import { connect } from "react-redux";
import { postScream, clearErrors } from "../redux/actions/dataActions";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  ...theme.styles,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "5%"
  }
});

const PostScream = ({ classes, UI: { loading, errors }, postScream, clearErrors }) => {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [errorsData, setErrorsData] = useState({});

  useEffect(() => {
    if (errors) {
      setErrorsData(errors);
    }
    if (!errors && !loading) {
      setBody("");
      setErrorsData({});
      setOpen(false);
    }
  }, [errors, loading]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    clearErrors();
    setOpen(false);
    setErrorsData({});
  };

  const handleChange = (event) => {
    setBody(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postScream({ body });
  };

  return (
    <Fragment>
      <MyButton tip='Post a Scream!' onClick={handleOpen}>
        <AddIcon />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <MyButton tip='Close' onClick={handleClose} tipClassName={classes.closeButton}>
          <CloseIcon />
        </MyButton>
        <DialogTitle>Post a new scream</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name='body'
              type='text'
              label='SCREAM!!'
              value={body}
              multiline
              rows='3'
              placeholder='Scream at your fellow apes'
              error={errorsData.body ? true : false}
              helperText={errorsData.body}
              className={classes.TextField}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && <CircularProgress size={30} className={classes.progressSpinner} />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

PostScream.propTypes = {
  UI: PropTypes.object.isRequired,
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

const mapActionsToProps = {
  postScream,
  clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostScream));
