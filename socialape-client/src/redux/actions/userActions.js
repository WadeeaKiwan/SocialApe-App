import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";
import axios from "axios";

export const loginUser = (formData, history) => async dispatch => {
  try {
    dispatch({ type: LOADING_UI });

    const res = await axios.post("/login", formData);

    const FBIdToken = `Bearer ${res.data.token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;

    dispatch(getUser());
    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (err) {
    console.error(err);
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getUser = () => async dispatch => {
  try {
    const res = await axios.get("/user");

    dispatch({
      type: SET_USER,
      payload: res.data
    });
  } catch (err) {
    console.error(err);
  }
};
