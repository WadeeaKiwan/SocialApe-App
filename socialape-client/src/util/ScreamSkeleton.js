import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import noImg from "../images/no-img.png";

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
  ...theme.styles,
  card: {
    display: "flex",
    marginBottom: 20
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25
  },
  cover: {
    minWidth: 200,
    objectFit: "cover"
  },
  handle: {
    width: 60,
    height: 18,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 10
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginBottom: 10
  },
  fullLine: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.6)",
    marginBottom: 10
  },
  halfLine: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0,0.6)",
    marginBottom: 10
  }
});

const ScreamSkeleton = ({ classes }) => {
  return (
    <Fragment>
      {Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
          <CardMedia className={classes.cover} image={noImg} />
          <CardContent className={classes.cardContent}>
            <div className={classes.handle}></div>
            <div className={classes.date}></div>
            <div className={classes.fullLine}></div>
            <div className={classes.fullLine}></div>
            <div className={classes.halfLine}></div>
          </CardContent>
        </Card>
      ))}
    </Fragment>
  );
};

ScreamSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScreamSkeleton);
