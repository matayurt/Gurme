import axios from "axios";
import {
  COMMENT_LIST_REQUEST,
  COMMENT_LIST_SUCCESS,
  COMMENT_LIST_FAIL,
  COMMENT_APPROVE_REQUEST,
  COMMENT_APPROVE_SUCCESS,
  COMMENT_APPROVE_FAIL,
  COMMENT_DELETE_REQUEST,
  COMMENT_DELETE_SUCCESS,
  COMMENT_DELETE_FAIL,
  COMMENT_ADD_REQUEST,
  COMMENT_ADD_SUCCESS,
  COMMENT_ADD_FAIL,
  COMMENT_APPROVED_LIST_REQUEST,
  COMMENT_APPROVED_LIST_SUCCESS,
  COMMENT_APPROVED_LIST_FAIL,
  COMMENT_UPDATE_REQUEST,
  COMMENT_UPDATE_SUCCESS,
  COMMENT_UPDATE_FAIL,
} from "../constants/commentConstants";
import { createSlice } from "@reduxjs/toolkit";

const sendCommentNotification = async (commentData) => {
  try {
    await axios.post(
      "http://localhost:5001/api/notifications/send-comment-email",
      {
        comment: commentData.comment,
        name: commentData.name,
        food: commentData.food,
      }
    );
  } catch (error) {
    console.error("Error sending notification email:", error);
  }
};

export const getUnapprovedComments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMENT_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(
      "http://localhost:5001/api/comments/unapproved",
      config
    );
    dispatch({ type: COMMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const approveComment = (commentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMENT_APPROVE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.put(
      `http://localhost:5001/api/comments/${commentId}/approve`,
      {},
      config
    );
    dispatch({ type: COMMENT_APPROVE_SUCCESS });
  } catch (error) {
    dispatch({
      type: COMMENT_APPROVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteComment = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMENT_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`http://localhost:5001/api/comments/${id}`, config);
    dispatch({ type: COMMENT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: COMMENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addComment = (restaurantId, commentData) => async (dispatch) => {
  try {
    dispatch({ type: COMMENT_ADD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://localhost:5001/api/restaurants/${restaurantId}/comments`,
      commentData,
      config
    );

    dispatch({ type: COMMENT_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMMENT_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getApprovedComments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMENT_APPROVED_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:5001/api/comments/approved",
      config
    );

    dispatch({
      type: COMMENT_APPROVED_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMMENT_APPROVED_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateComment =
  (id, updatedComment) => async (dispatch, getState) => {
    try {
      dispatch({ type: COMMENT_UPDATE_REQUEST });

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
        `http://localhost:5001/api/comments/${id}`,
        updatedComment,
        config
      );

      dispatch({ type: COMMENT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COMMENT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const CHECK_NEW_COMMENTS = "CHECK_NEW_COMMENTS";

export const checkNewComments = () => async (dispatch) => {
  try {
    const { data } = await axios.get("http://localhost:5001/api/comments/new");

    dispatch({
      type: CHECK_NEW_COMMENTS,
      payload: data.newComments,
    });
  } catch (error) {
    console.error("Error checking new comments", error);
  }
};

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    success: false,
    error: null,
  },
  reducers: {
    addCommentSuccess: (state) => {
      state.success = true;
    },
    addCommentFail: (state, action) => {
      state.error = action.payload;
    },
    resetCommentState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const { addCommentSuccess, addCommentFail, resetCommentState } =
  commentSlice.actions;
export default commentSlice.reducer;
