import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import MyButton from "../util/MyButton";

// Redux
import { connect } from "react-redux";
import { getScream } from "../redux/actions/dataActions";

// MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

const styles = (theme) => ({
  ...theme.styles,
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {
    position: "absolute",
    left: "90%"
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

export const ScreamDialog = ({
  classes,
  scream: { body, createdAt, likeCount, commentCount, userImage },
  screamId,
  userHandle,
  UI: { loading },
  getScream
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    getScream(screamId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <MyButton onClick={handleOpen} tip='Expand Scream' tipClassName={classes.expandButton}>
        <UnfoldMore color='primary' />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <MyButton tip='Close' onClick={handleClose} tipClassName={classes.closeButton}>
          <CloseIcon />
        </MyButton>
        <DialogContent className={classes.dialogContent}>
          {loading ? (
            <div className={classes.spinnerDiv}>
              <CircularProgress size={200} thickness={2} />
            </div>
          ) : (
            <Grid container spacing={10}>
              <Grid item sm={5}>
                <img src={userImage} alt='Profile' className={classes.profileImage} />
              </Grid>
              <Grid item sm={7}>
                <Typography
                  component={Link}
                  color='primary'
                  variant='h5'
                  to={`/users/${userHandle}`}
                >
                  @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography variant='body2' color='textSecondary'>
                  {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography variant='body1'>{body}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

ScreamDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  getScream: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = {
  getScream
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
