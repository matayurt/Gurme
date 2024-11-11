import {
  COMMENT_LIST_REQUEST,
  COMMENT_LIST_SUCCESS,
  COMMENT_LIST_FAIL,
  COMMENT_LIST_UNAPPROVED_SUCCESS,
  COMMENT_LIST_APPROVED_SUCCESS,
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
import { CHECK_NEW_COMMENTS } from "../actions/commentActions";

const initialState = { comments: [], loading: false, error: null };

export const commentListReducer = (state = { comments: [] }, action) => {
  switch (action.type) {
    case COMMENT_LIST_REQUEST:
      return { loading: true, comments: [] };
    case COMMENT_LIST_SUCCESS:
      return { loading: false, comments: action.payload };
    case COMMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case COMMENT_LIST_UNAPPROVED_SUCCESS:
      return { loading: false, comments: action.payload };
    case COMMENT_LIST_APPROVED_SUCCESS:
      return { loading: false, comments: action.payload };
    default:
      return state;
  }
};

export const commentApproveReducer = (state = {}, action) => {
  switch (action.type) {
    case COMMENT_APPROVE_REQUEST:
      return { loading: true };
    case COMMENT_APPROVE_SUCCESS:
      return { loading: false, success: true };
    case COMMENT_APPROVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const commentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case COMMENT_DELETE_REQUEST:
      return { loading: true };
    case COMMENT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case COMMENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const commentAddReducer = (state = {}, action) => {
  switch (action.type) {
    case COMMENT_ADD_REQUEST:
      return { loading: true };
    case COMMENT_ADD_SUCCESS:
      return { loading: false, success: true };
    case COMMENT_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const commentUnapprovedReducer = (state = { comments: [] }, action) => {
  switch (action.type) {
    case "COMMENT_UNAPPROVED_REQUEST":
      return { loading: true, comments: [] };
    case "COMMENT_UNAPPROVED_SUCCESS":
      return { loading: false, comments: action.payload };
    case "COMMENT_UNAPPROVED_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const commentApprovedListReducer = (
  state = { comments: [] },
  action
) => {
  switch (action.type) {
    case COMMENT_APPROVED_LIST_REQUEST:
      return { loading: true, comments: [] };
    case COMMENT_APPROVED_LIST_SUCCESS:
      return { loading: false, comments: action.payload };
    case COMMENT_APPROVED_LIST_FAIL:
      return { loading: false, error: action.payload };
    case COMMENT_DELETE_SUCCESS:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const newCommentsReducer = (state = { newComments: false }, action) => {
  switch (action.type) {
    case CHECK_NEW_COMMENTS:
      return {
        newComments: action.payload,
      };
    default:
      return state;
  }
};

export const commentUnapprovedListReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMMENT_LIST_REQUEST:
      return { ...state, loading: true };
    case COMMENT_LIST_SUCCESS:
      return { ...state, loading: false, comments: action.payload };
    case COMMENT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const commentApprovedReducer = (state = { comments: [] }, action) => {
  switch (action.type) {
    case "COMMENT_APPROVED_REQUEST":
      return { loading: true, comments: [] };
    case "COMMENT_APPROVED_SUCCESS":
      return { loading: false, comments: action.payload };
    case "COMMENT_APPROVED_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const approvedCommentListReducer = (
  state = { comments: [] },
  action
) => {
  switch (action.type) {
    case COMMENT_LIST_APPROVED_SUCCESS:
      return { loading: false, comments: action.payload };
    case COMMENT_APPROVE_SUCCESS:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };
    case COMMENT_DELETE_SUCCESS:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const commentUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case COMMENT_UPDATE_REQUEST:
      return { loading: true };
    case COMMENT_UPDATE_SUCCESS:
      return { loading: false, success: true, comment: action.payload };
    case COMMENT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
