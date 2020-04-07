import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
  ...theme.styles,
  button: {
    float: "right"
  }
});

const EditDetails = ({ classes, credentials: { bio, website, location }, editUserDetails }) => {
  const [userDetails, setUserDetails] = useState({
    bio: "",
    website: "",
    location: ""
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    mapUserDetailsToState(bio, website, location);
  }, [bio, location, website]);

  const handleOpen = () => {
    setOpen(true);
    mapUserDetailsToState(bio, website, location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mapUserDetailsToState = (bio, website, location) => {
    setUserDetails({
      bio: bio ? bio : "",
      website: website ? website : "",
      location: location ? location : ""
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
    console.log(userDetails);
  };

  const handleSubmit = () => {
    editUserDetails(userDetails);
    handleClose();
  };

  return (
    <Fragment>
      <Tooltip title='Edit Details' placement='top'>
        <IconButton onClick={handleOpen} className={classes.button}>
          <EditIcon color='primary' />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name='bio'
              type='text'
              label='Bio'
              multiline
              rows='3'
              placeholder='A short bio about yourself'
              className={classes.textField}
              value={userDetails.bio}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name='website'
              type='text'
              label='Website'
              placeholder='Your personal/professional website'
              className={classes.textField}
              value={userDetails.website}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name='location'
              type='text'
              label='Location'
              placeholder='Where you live'
              className={classes.textField}
              value={userDetails.location}
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

EditDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials
});

const mapActionsToProps = {
  editUserDetails
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));
