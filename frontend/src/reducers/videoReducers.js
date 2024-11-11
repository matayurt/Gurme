import {
  VIDEO_ADD_REQUEST,
  VIDEO_ADD_SUCCESS,
  VIDEO_ADD_FAIL,
  VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS,
  VIDEO_LIST_FAIL,
  VIDEO_DELETE_REQUEST,
  VIDEO_DELETE_SUCCESS,
  VIDEO_DELETE_FAIL,
} from "../constants/videoConstants";

// Video ekleme reducer
export const videoAddReducer = (state = {}, action) => {
  switch (action.type) {
    case VIDEO_ADD_REQUEST:
      return { loading: true };
    case VIDEO_ADD_SUCCESS:
      return { loading: false, success: true, video: action.payload };
    case VIDEO_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Video listesi reducer
export const videoListReducer = (state = { videos: [] }, action) => {
  switch (action.type) {
    case VIDEO_LIST_REQUEST:
      return { loading: true, videos: [] };
    case VIDEO_LIST_SUCCESS:
      return { loading: false, videos: action.payload };
    case VIDEO_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Video silme reducer
export const videoDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case VIDEO_DELETE_REQUEST:
      return { loading: true };
    case VIDEO_DELETE_SUCCESS:
      return { loading: false, success: true };
    case VIDEO_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
