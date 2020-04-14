import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import MyButton from "../../util/MyButton";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { connect } from "react-redux";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

const Scream = ({
  classes,
  scream: { body, userHandle, createdAt, screamId, likeCount, commentCount, userImage },
  user: {
    authenticated,
    credentials: { handle }
  }
}) => {
  dayjs.extend(relativeTime);

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia className={classes.image} image={userImage} title='Profile image' />
        <CardContent className={classes.content}>
          <Typography variant='h5' component={Link} to={`/users/${userHandle}`} color='primary'>
            {userHandle}
          </Typography>
          {authenticated && userHandle === handle ? <DeleteScream screamId={screamId} /> : null}
          <Typography variant='body2' color='textSecondary' component='p'>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography>{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <MyButton tip='Comments'>
            <ChatIcon color='primary' />
          </MyButton>
          <span>{commentCount} comments</span>
          <ScreamDialog screamId={screamId} userHandle={userHandle} />
        </CardContent>
      </Card>
    </div>
  );
};

Scream.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
