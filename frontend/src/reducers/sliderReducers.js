import {
  SLIDER_LIST_REQUEST,
  SLIDER_LIST_SUCCESS,
  SLIDER_LIST_FAIL,
  SLIDER_ADD_REQUEST,
  SLIDER_ADD_SUCCESS,
  SLIDER_ADD_FAIL,
  SLIDER_UPDATE_REQUEST,
  SLIDER_UPDATE_SUCCESS,
  SLIDER_UPDATE_FAIL,
  SLIDER_DELETE_REQUEST,
  SLIDER_DELETE_SUCCESS,
  SLIDER_DELETE_FAIL,
} from "../constants/sliderConstants";

export const sliderListReducer = (state = { sliders: [] }, action) => {
  switch (action.type) {
    case SLIDER_LIST_REQUEST:
      return { loading: true, sliders: [] };
    case SLIDER_LIST_SUCCESS:
      return { loading: false, sliders: action.payload };
    case SLIDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const sliderAddReducer = (state = {}, action) => {
  switch (action.type) {
    case SLIDER_ADD_REQUEST:
      return { loading: true };
    case SLIDER_ADD_SUCCESS:
      return { loading: false, success: true };
    case SLIDER_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const sliderUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SLIDER_UPDATE_REQUEST:
      return { loading: true };
    case SLIDER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case SLIDER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const sliderDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SLIDER_DELETE_REQUEST:
      return { loading: true };
    case SLIDER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SLIDER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
