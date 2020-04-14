import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import MyButton from "../../util/MyButton";

// MUI Stuff
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../../redux/actions/dataActions";

const LikeButton = ({ user: { authenticated, likes }, screamId, likeScream, unlikeScream }) => {
  const likedScream = () => {
    if (likes && likes.find((like) => like.screamId === screamId)) {
      return true;
    }
    return false;
  };

  return !authenticated ? (
    <Link to='/login'>
      <MyButton tip='Like'>
        <FavoriteBorder color='primary' />
      </MyButton>
    </Link>
  ) : likedScream() ? (
    <MyButton tip='Undo like' onClick={() => unlikeScream(screamId)}>
      <FavoriteIcon color='primary' />
    </MyButton>
  ) : (
    <MyButton tip='Like' onClick={() => likeScream(screamId)}>
      <FavoriteBorder color='primary' />
    </MyButton>
  );
};

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
