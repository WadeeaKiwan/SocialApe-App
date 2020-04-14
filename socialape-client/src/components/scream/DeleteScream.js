import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import MyButton from "../../util/MyButton";

import { connect } from "react-redux";
import { deleteScream } from "../../redux/actions/dataActions";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
};

const DeleteScream = ({ classes, screamId, deleteScream }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeScream = () => {
    deleteScream(screamId);
    handleClose();
  };

  return (
    <Fragment>
      <MyButton tip='Delete Scream' onClick={handleOpen} btnClassName={classes.deleteButton}>
        <DeleteOutline color='secondary' />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Are you sure you want to delete this scream?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={removeScream} color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

DeleteScream.propTypes = {
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  deleteScream: PropTypes.func.isRequired
};

const mapActionsToProps = {
  deleteScream
};

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteScream));
