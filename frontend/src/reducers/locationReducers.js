import {
  GET_COUNTRIES_REQUEST,
  GET_COUNTRIES_SUCCESS,
  GET_COUNTRIES_FAIL,
  GET_CITIES_REQUEST,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAIL,
  GET_DISTRICTS_REQUEST,
  GET_DISTRICTS_SUCCESS,
  GET_DISTRICTS_FAIL,
} from "../constants/locationConstants";

export const locationReducer = (
  state = { countries: [], cities: [], districts: [] },
  action
) => {
  switch (action.type) {
    case GET_COUNTRIES_REQUEST:
    case GET_CITIES_REQUEST:
    case GET_DISTRICTS_REQUEST:
      return { ...state, loading: true };

    case GET_COUNTRIES_SUCCESS:
      return { ...state, loading: false, countries: action.payload };

    case GET_CITIES_SUCCESS:
      return { ...state, loading: false, cities: action.payload };

    case GET_DISTRICTS_SUCCESS:
      return { ...state, loading: false, districts: action.payload };

    case GET_COUNTRIES_FAIL:
    case GET_CITIES_FAIL:
    case GET_DISTRICTS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
