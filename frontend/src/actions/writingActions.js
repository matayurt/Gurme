import axios from "axios";
import {
  WRITING_LIST_REQUEST,
  WRITING_LIST_SUCCESS,
  WRITING_LIST_FAIL,
  WRITING_ADD_REQUEST,
  WRITING_ADD_SUCCESS,
  WRITING_ADD_FAIL,
  WRITING_DELETE_REQUEST,
  WRITING_DELETE_SUCCESS,
  WRITING_DELETE_FAIL,
  WRITING_UPDATE_REQUEST,
  WRITING_UPDATE_SUCCESS,
  WRITING_UPDATE_FAIL,
  WRITING_DETAILS_REQUEST,
  WRITING_DETAILS_SUCCESS,
  WRITING_DETAILS_FAIL,
} from "../constants/writingConstants";

// Yazıları listele
export const listWritings = () => async (dispatch) => {
  try {
    dispatch({ type: WRITING_LIST_REQUEST });
    const { data } = await axios.get("http://localhost:5001/api/writings");
    dispatch({ type: WRITING_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WRITING_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMostClickedWritings = () => async (dispatch) => {
  try {
    dispatch({ type: WRITING_LIST_REQUEST });
    const { data } = await axios.get(
      "http://localhost:5001/api/writings/most-clicked"
    );
    dispatch({ type: WRITING_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WRITING_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const incrementClickCount = (id) => async (dispatch) => {
  try {
    await axios.post(`http://localhost:5001/api/writings/${id}/click`);
  } catch (error) {
    console.error("Failed to increment click count:", error);
  }
};

// Yeni yazı ekle
export const addWriting = (writingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: WRITING_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:5001/api/writings",
      writingData,
      config
    );
    dispatch({ type: WRITING_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WRITING_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Yazıyı güncelle
export const updateWriting =
  (id, writingData) => async (dispatch, getState) => {
    try {
      dispatch({ type: WRITING_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5001/api/writings/${id}`,
        writingData,
        config
      );
      dispatch({ type: WRITING_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: WRITING_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// Yazıyı sil
export const deleteWriting = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: WRITING_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`http://localhost:5001/api/writings/${id}`, config);
    dispatch({ type: WRITING_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: WRITING_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getWritingDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: WRITING_DETAILS_REQUEST });

    const { data } = await axios.get(
      `http://localhost:5001/api/writings/${id}`
    );

    dispatch({ type: WRITING_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WRITING_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
