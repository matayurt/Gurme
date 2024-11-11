import axios from "axios";
import {
  QUESTION_LIST_REQUEST,
  QUESTION_LIST_SUCCESS,
  QUESTION_LIST_FAIL,
  QUESTION_ADD_REQUEST,
  QUESTION_ADD_SUCCESS,
  QUESTION_ADD_FAIL,
  QUESTION_DELETE_REQUEST,
  QUESTION_DELETE_SUCCESS,
  QUESTION_DELETE_FAIL,
  QUESTION_EDIT_REQUEST,
  QUESTION_EDIT_SUCCESS,
  QUESTION_EDIT_FAIL,
  QUESTION_UPDATE_ORDER_SUCCESS,
  QUESTION_UPDATE_ORDER_FAIL,
} from "../constants/questionConstants";

const getToken = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  return userInfo?.token;
};

export const fetchQuestions = () => async (dispatch) => {
  try {
    dispatch({ type: QUESTION_LIST_REQUEST });

    const { data } = await axios.get("http://localhost:5001/api/questions");

    dispatch({ type: QUESTION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: QUESTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateQuestionOrder =
  (reorderedQuestions) => async (dispatch, getState) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        "http://localhost:5001/api/questions/reorder",
        reorderedQuestions,
        config
      );
      dispatch({
        type: QUESTION_UPDATE_ORDER_SUCCESS,
        payload: reorderedQuestions,
      });
    } catch (error) {
      dispatch({
        type: QUESTION_UPDATE_ORDER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addQuestion = (newQuestion) => async (dispatch, getState) => {
  try {
    dispatch({ type: QUESTION_ADD_REQUEST });

    const token = getToken(getState);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:5001/api/questions",
      newQuestion,
      config
    );
    dispatch({ type: QUESTION_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: QUESTION_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteQuestion = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: QUESTION_DELETE_REQUEST });

    const token = getToken(getState);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`http://localhost:5001/api/questions/${id}`, config);
    dispatch({ type: QUESTION_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: QUESTION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const editQuestion =
  (id, updatedQuestion) => async (dispatch, getState) => {
    try {
      dispatch({ type: QUESTION_EDIT_REQUEST });

      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5001/api/questions/${id}`,
        updatedQuestion,
        config
      );
      dispatch({ type: QUESTION_EDIT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: QUESTION_EDIT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
