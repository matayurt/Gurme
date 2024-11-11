import {
  REPLY_LIST_REQUEST,
  REPLY_LIST_SUCCESS,
  REPLY_LIST_FAIL,
  REPLY_APPROVE_SUCCESS,
  REPLY_DELETE_SUCCESS,
} from "../constants/replyConstants";

export const replyListReducer = (state = { replies: [] }, action) => {
  switch (action.type) {
    case REPLY_LIST_REQUEST:
      return { loading: true, replies: [] };
    case REPLY_LIST_SUCCESS:
      return { loading: false, replies: action.payload };
    case REPLY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case REPLY_APPROVE_SUCCESS:
      return {
        ...state,
        replies: state.replies.map((reply) =>
          reply._id === action.payload ? { ...reply, isApproved: true } : reply
        ),
      };
    case REPLY_DELETE_SUCCESS:
      return {
        ...state,
        replies: state.replies.filter((reply) => reply._id !== action.payload),
      };
    default:
      return state;
  }
};
