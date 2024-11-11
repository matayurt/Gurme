import axios from "axios";
import {
  REPLY_LIST_REQUEST,
  REPLY_LIST_SUCCESS,
  REPLY_LIST_FAIL,
  REPLY_APPROVE_SUCCESS,
  REPLY_DELETE_SUCCESS,
} from "../constants/replyConstants";

// Yanıtları Al
export const getUnapprovedReplies = () => async (dispatch) => {
  try {
    dispatch({ type: REPLY_LIST_REQUEST });

    const { data } = await axios.get("/api/replies/unapproved");

    dispatch({
      type: REPLY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REPLY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Yanıtı Onayla
export const approveReply = (replyId) => async (dispatch) => {
  try {
    await axios.put(`/api/replies/${replyId}/approve`);
    dispatch({ type: REPLY_APPROVE_SUCCESS, payload: replyId });
  } catch (error) {
    console.error(error);
  }
};

// Yanıtı Sil
export const deleteReply = (replyId) => async (dispatch) => {
  try {
    await axios.delete(`/api/replies/${replyId}`);
    dispatch({ type: REPLY_DELETE_SUCCESS, payload: replyId });
  } catch (error) {
    console.error(error);
  }
};
