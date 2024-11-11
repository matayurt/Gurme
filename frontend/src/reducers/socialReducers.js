import {
  SOCIAL_LINKS_REQUEST,
  SOCIAL_LINKS_SUCCESS,
  SOCIAL_LINKS_FAIL,
  SOCIAL_LINKS_UPDATE_REQUEST,
  SOCIAL_LINKS_UPDATE_SUCCESS,
  SOCIAL_LINKS_UPDATE_FAIL,
} from "../constants/socialConstants";

export const socialLinksReducer = (state = { socialLinks: {} }, action) => {
  switch (action.type) {
    case SOCIAL_LINKS_REQUEST:
      return { loading: true, ...state };
    case SOCIAL_LINKS_SUCCESS:
      return { loading: false, socialLinks: action.payload };
    case SOCIAL_LINKS_FAIL:
      return { loading: false, error: action.payload };
    case SOCIAL_LINKS_UPDATE_REQUEST:
      return { ...state, loading: true };
    case SOCIAL_LINKS_UPDATE_SUCCESS:
      return { loading: false, success: true, socialLinks: action.payload };
    case SOCIAL_LINKS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
