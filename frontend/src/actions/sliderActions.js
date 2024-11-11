import axios from "axios";
import {
  SLIDER_ADD_REQUEST,
  SLIDER_ADD_SUCCESS,
  SLIDER_ADD_FAIL,
  SLIDER_LIST_REQUEST,
  SLIDER_LIST_SUCCESS,
  SLIDER_LIST_FAIL,
  SLIDER_UPDATE_REQUEST,
  SLIDER_UPDATE_SUCCESS,
  SLIDER_UPDATE_FAIL,
  SLIDER_DELETE_REQUEST,
  SLIDER_DELETE_SUCCESS,
  SLIDER_DELETE_FAIL,
} from "../constants/sliderConstants";

const getConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

export const fetchSliders =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: SLIDER_LIST_REQUEST });

      const query = new URLSearchParams(params).toString();
      const { data } = await axios.get(
        `http://localhost:5001/api/sliders?${query}`
      );

      dispatch({ type: SLIDER_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SLIDER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// Yeni slider ekle
export const addSlider = (sliderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SLIDER_ADD_REQUEST });

    const config = getConfig(getState);
    const { data } = await axios.post(
      "http://localhost:5001/api/sliders",
      sliderData,
      config
    );

    dispatch({ type: SLIDER_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SLIDER_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Slider güncelle
export const updateSlider = (id, sliderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SLIDER_UPDATE_REQUEST });

    const config = getConfig(getState);
    const { data } = await axios.put(
      `http://localhost:5001/api/sliders/${id}`,
      sliderData,
      config
    );

    dispatch({ type: SLIDER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SLIDER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Slider sil
export const deleteSlider = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SLIDER_DELETE_REQUEST });

    const config = getConfig(getState);
    await axios.delete(`http://localhost:5001/api/sliders/${id}`, config);

    dispatch({ type: SLIDER_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: SLIDER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
