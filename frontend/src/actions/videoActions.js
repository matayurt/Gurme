import axios from "axios";
import {
  VIDEO_ADD_REQUEST,
  VIDEO_ADD_SUCCESS,
  VIDEO_ADD_FAIL,
  VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS,
  VIDEO_LIST_FAIL,
  VIDEO_DELETE_REQUEST,
  VIDEO_DELETE_SUCCESS,
  VIDEO_DELETE_FAIL,
} from "../constants/videoConstants";

const getConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };
};

// Videoları getir
export const fetchVideos = () => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_LIST_REQUEST });

    const { data } = await axios.get("http://localhost:5001/api/videos");

    dispatch({ type: VIDEO_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: VIDEO_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Yeni video ekle
export const addVideo = (videoData) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIDEO_ADD_REQUEST });

    const config = getConfig(getState);
    const { data } = await axios.post(
      "http://localhost:5001/api/videos/add",
      videoData,
      config
    );

    dispatch({ type: VIDEO_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: VIDEO_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Videoyu sil
export const deleteVideo = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIDEO_DELETE_REQUEST });

    const config = getConfig(getState);
    await axios.delete(`http://localhost:5001/api/videos/${id}`, config);

    dispatch({ type: VIDEO_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: VIDEO_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
