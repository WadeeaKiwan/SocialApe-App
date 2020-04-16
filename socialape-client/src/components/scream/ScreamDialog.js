import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

// Redux
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../redux/actions/dataActions";

// MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

const styles = (theme) => ({
  ...theme.styles,
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
  scream: { body, createdAt, likeCount, commentCount, userImage, comments },
  screamId,
  userHandle,
  UI: { loading },
  getScream,
  clearErrors,
  openDialog
}) => {
  const [open, setOpen] = useState(false);
  const [oldPath, setOldPath] = useState("");

  useEffect(() => {
    if (openDialog) {
      handleOpen();
    }
  }, []);

  const handleOpen = () => {
    setOldPath(window.location.pathname);
    const newPath = `/users/${userHandle}/scream/${screamId}`;
    window.history.pushState(null, null, newPath);

    if (oldPath === newPath) setOldPath(`/users/${userHandle}`);

    getScream(screamId);
    setOpen(true);
  };

  const handleClose = () => {
    window.history.pushState(null, null, oldPath);

    setOpen(false);
    clearErrors();
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
            <Grid container spacing={16}>
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
                <Typography>{body}</Typography>
                <LikeButton screamId={screamId} />
                <span>{likeCount} likes</span>
                <MyButton tip='Comments'>
                  <ChatIcon color='primary' />
                </MyButton>
                <span>{commentCount} comments</span>
              </Grid>
              <hr className={classes.visibleSeparator} />
              <CommentForm screamId={screamId} />
              <Comments comments={comments} />
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
  getScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = {
  getScream,
  clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
