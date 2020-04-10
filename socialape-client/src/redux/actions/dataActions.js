import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  LOADING_UI,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS
} from "../types";
import axios from "axios";

// Get All Screams
export const getScreams = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_DATA });

    const res = await axios.get("/screams");

    dispatch({
      type: SET_SCREAMS,
      payload: res.data
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SET_SCREAMS,
      payload: []
    });
  }
};

// Post a scream
export const postScream = (newScream) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });

    const res = await axios.post("/scream", newScream);

    dispatch({
      type: POST_SCREAM,
      payload: res.data
    });

    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    // console.error(err);

    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    });
  }
};

// Like a scream
export const likeScream = (screamId) => async (dispatch) => {
  try {
    const res = await axios.get(`/scream/${screamId}/like`);

    dispatch({
      type: LIKE_SCREAM,
      payload: res.data
    });
  } catch (err) {
    console.error(err);
  }
};

// Unlike a scream
export const unlikeScream = (screamId) => async (dispatch) => {
  try {
    const res = await axios.get(`/scream/${screamId}/unlike`);

    dispatch({
      type: UNLIKE_SCREAM,
      payload: res.data
    });
  } catch (err) {
    console.error(err);
  }
};

// Delete a scream
export const deleteScream = (screamId) => async (dispatch) => {
  try {
    await axios.delete(`/scream/${screamId}`);

    dispatch({
      type: DELETE_SCREAM,
      payload: screamId
    });
  } catch (err) {
    console.error(err);
  }
};
