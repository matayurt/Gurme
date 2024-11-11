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
} from "../constants/questionConstants";

export const questionListReducer = (state = { questions: [] }, action) => {
  switch (action.type) {
    case QUESTION_LIST_REQUEST:
      return { loading: true, questions: [] };
    case QUESTION_LIST_SUCCESS:
      return { loading: false, questions: action.payload };
    case QUESTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const questionAddReducer = (state = {}, action) => {
  switch (action.type) {
    case QUESTION_ADD_REQUEST:
      return { loading: true };
    case QUESTION_ADD_SUCCESS:
      return { loading: false, success: true, question: action.payload };
    case QUESTION_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const questionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case QUESTION_DELETE_REQUEST:
      return { loading: true };
    case QUESTION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case QUESTION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const questionEditReducer = (state = { question: {} }, action) => {
  switch (action.type) {
    case QUESTION_EDIT_REQUEST:
      return { loading: true };
    case QUESTION_EDIT_SUCCESS:
      return { loading: false, success: true, question: action.payload };
    case QUESTION_EDIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
