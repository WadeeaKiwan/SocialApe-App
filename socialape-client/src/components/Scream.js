import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
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
  scream: { body, userHandle, createdAt, likeCount, commentCount, userImage }
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
          <Typography variant='body2' color='textSecondary' component='p'>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography>{body}</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default withStyles(styles)(Scream);
