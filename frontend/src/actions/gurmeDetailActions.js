import axios from "axios";
import {
  GURME_DETAIL_REQUEST,
  GURME_DETAIL_SUCCESS,
  GURME_DETAIL_FAIL,
  GURME_DETAIL_UPDATE_REQUEST,
  GURME_DETAIL_UPDATE_SUCCESS,
  GURME_DETAIL_UPDATE_FAIL,
} from "../constants/gurmeDetailConstants.js";

// Gurme detaylarını getir
export const fetchGurmeDetail = () => async (dispatch) => {
  try {
    dispatch({ type: GURME_DETAIL_REQUEST });

    const { data } = await axios.get("http://localhost:5001/api/gurmeDetail");

    dispatch({
      type: GURME_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GURME_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Gurme detaylarını güncelle
export const updateGurmeDetail = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: GURME_DETAIL_UPDATE_REQUEST });

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
      "http://localhost:5001/api/gurmeDetail",
      formData,
      config
    );

    dispatch({
      type: GURME_DETAIL_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GURME_DETAIL_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
