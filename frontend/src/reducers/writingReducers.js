import {
  WRITING_LIST_REQUEST,
  WRITING_LIST_SUCCESS,
  WRITING_LIST_FAIL,
  WRITING_ADD_REQUEST,
  WRITING_ADD_SUCCESS,
  WRITING_ADD_FAIL,
  WRITING_DELETE_REQUEST,
  WRITING_DELETE_SUCCESS,
  WRITING_DELETE_FAIL,
  WRITING_UPDATE_REQUEST,
  WRITING_UPDATE_SUCCESS,
  WRITING_UPDATE_FAIL,
  WRITING_DETAILS_REQUEST,
  WRITING_DETAILS_SUCCESS,
  WRITING_DETAILS_FAIL,
} from "../constants/writingConstants";

// Yazı listesi reducer'ı
export const writingListReducer = (state = { writings: [] }, action) => {
  switch (action.type) {
    case WRITING_LIST_REQUEST:
      return { loading: true, writings: [] };
    case WRITING_LIST_SUCCESS:
      return { loading: false, writings: action.payload };
    case WRITING_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Yazı ekleme reducer'ı
export const writingAddReducer = (state = {}, action) => {
  switch (action.type) {
    case WRITING_ADD_REQUEST:
      return { loading: true };
    case WRITING_ADD_SUCCESS:
      return { loading: false, success: true, writing: action.payload };
    case WRITING_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Yazı silme reducer'ı
export const writingDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case WRITING_DELETE_REQUEST:
      return { loading: true };
    case WRITING_DELETE_SUCCESS:
      return { loading: false, success: true };
    case WRITING_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Yazı güncelleme reducer'ı
export const writingUpdateReducer = (state = { writing: {} }, action) => {
  switch (action.type) {
    case WRITING_UPDATE_REQUEST:
      return { loading: true };
    case WRITING_UPDATE_SUCCESS:
      return { loading: false, success: true, writing: action.payload };
    case WRITING_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const writingDetailsReducer = (state = { writing: {} }, action) => {
  switch (action.type) {
    case WRITING_DETAILS_REQUEST:
      return { loading: true, ...state };
    case WRITING_DETAILS_SUCCESS:
      return { loading: false, writing: action.payload };
    case WRITING_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
