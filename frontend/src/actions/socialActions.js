import axios from "axios";
import {
  SOCIAL_LINKS_REQUEST,
  SOCIAL_LINKS_SUCCESS,
  SOCIAL_LINKS_FAIL,
  SOCIAL_LINKS_UPDATE_REQUEST,
  SOCIAL_LINKS_UPDATE_SUCCESS,
  SOCIAL_LINKS_UPDATE_FAIL,
} from "../constants/socialConstants";

export const fetchSocialLinks = () => async (dispatch) => {
  try {
    dispatch({ type: SOCIAL_LINKS_REQUEST });
    const { data } = await axios.get("http://localhost:5001/api/social");
    dispatch({ type: SOCIAL_LINKS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SOCIAL_LINKS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateSocialLinks =
  (socialLinks) => async (dispatch, getState) => {
    try {
      dispatch({ type: SOCIAL_LINKS_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5001/api/social",
        socialLinks,
        config
      );

      dispatch({ type: SOCIAL_LINKS_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SOCIAL_LINKS_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
