import {
  RESTAURANT_ADD_REQUEST,
  RESTAURANT_ADD_SUCCESS,
  RESTAURANT_ADD_FAIL,
  RESTAURANT_LIST_REQUEST,
  RESTAURANT_LIST_SUCCESS,
  RESTAURANT_LIST_FAIL,
  RESTAURANT_FOODS_REQUEST,
  RESTAURANT_FOODS_SUCCESS,
  RESTAURANT_FOODS_FAIL,
  RESTAURANT_DETAILS_REQUEST,
  RESTAURANT_DETAILS_SUCCESS,
  RESTAURANT_DETAILS_FAIL,
  COMMENT_ADD_REQUEST,
  COMMENT_ADD_SUCCESS,
  COMMENT_ADD_FAIL,
} from "../constants/restaurantConstants";

export const restaurantAddReducer = (state = {}, action) => {
  switch (action.type) {
    case RESTAURANT_ADD_REQUEST:
      return { loading: true };
    case RESTAURANT_ADD_SUCCESS:
      return { loading: false, success: true, restaurant: action.payload };
    case RESTAURANT_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const restaurantListReducer = (state = { restaurants: [] }, action) => {
  switch (action.type) {
    case RESTAURANT_LIST_REQUEST:
      return { loading: true, restaurants: [] };
    case RESTAURANT_LIST_SUCCESS:
      return { loading: false, restaurants: action.payload };
    case RESTAURANT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const restaurantFoodsReducer = (state = { foods: [] }, action) => {
  switch (action.type) {
    case RESTAURANT_FOODS_REQUEST:
      return { loading: true, foods: [] };
    case RESTAURANT_FOODS_SUCCESS:
      return { loading: false, foods: action.payload };
    case RESTAURANT_FOODS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const restaurantDetailsReducer = (
  state = { restaurant: { foods: [] } },
  action
) => {
  switch (action.type) {
    case RESTAURANT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case RESTAURANT_DETAILS_SUCCESS:
      return { loading: false, restaurant: action.payload };
    case RESTAURANT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
