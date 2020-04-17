import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import noImg from "../images/no-img.png";

// MUI Stuff
import Paper from "@material-ui/core/Paper";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalenderToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
  ...theme.styles,
  handle: {
    width: 60,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    margin: "0 auto 7px auto"
  },
  fullLine: {
    height: 15,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    marginBottom: 10
  },
  halfLine: {
    display: "inline-block",
    height: 15,
    width: "60%",
    backgroundColor: "rgba(0,0,0,0.6)"
  }
});

const ProfileSkeleton = ({ classes }) => {
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className='image-wrapper'>
          <img src={noImg} alt='profile' className='profile-image' />
        </div>
        <hr />
        <div className='profile-details'>
          <div className={classes.handle} />
          <hr />
          <div className={classes.fullLine} />
          <div className={classes.fullLine} />
          <hr />
          <LocationOn color='primary' /> <span className={classes.halfLine}></span>
          <hr />
          <LinkIcon color='primary' /> <span className={classes.halfLine}></span>
          <hr />
          <CalenderToday color='primary' /> <span className={classes.halfLine}></span>
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);
