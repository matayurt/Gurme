import {
  GURME_DETAIL_REQUEST,
  GURME_DETAIL_SUCCESS,
  GURME_DETAIL_FAIL,
  GURME_DETAIL_UPDATE_REQUEST,
  GURME_DETAIL_UPDATE_SUCCESS,
  GURME_DETAIL_UPDATE_FAIL,
} from "../constants/gurmeDetailConstants.js";

export const gurmeDetailReducer = (state = { gurmeDetail: {} }, action) => {
  switch (action.type) {
    case GURME_DETAIL_REQUEST:
      return { loading: true, ...state };
    case GURME_DETAIL_SUCCESS:
      return { loading: false, gurmeDetail: action.payload };
    case GURME_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case GURME_DETAIL_UPDATE_REQUEST:
      return { ...state, loading: true };
    case GURME_DETAIL_UPDATE_SUCCESS:
      return { loading: false, success: true, gurmeDetail: action.payload };
    case GURME_DETAIL_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
