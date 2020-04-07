import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
} from "../types";
import axios from "axios";

export const loginUser = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });

    const res = await axios.post("/login", formData);

    setAuthorizationHeader(res.data.token);

    dispatch(getUser());
    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (err) {
    console.error(err);
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const signupUser = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });

    const res = await axios.post("/signup", formData);

    setAuthorizationHeader(res.data.token);

    dispatch(getUser());
    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (err) {
    console.error(err);
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    const res = await axios.get("/user");

    dispatch({
      type: SET_USER,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const uploadImage = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    await axios.post("/user/image", formData);

    dispatch(getUser());
  } catch (err) {
    console.error(err);
  }
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    await axios.post("/user", userDetails);

    dispatch(getUser());
  } catch (err) {
    console.error(err);
  }
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
