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

export const getCountries = () => async (dispatch) => {
  try {
    dispatch({ type: GET_COUNTRIES_REQUEST });

    const response = await fetch("/api/location/countries");
    const data = await response.json();

    dispatch({
      type: GET_COUNTRIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_COUNTRIES_FAIL,
      payload: error.message || "Countries could not be loaded.",
    });
  }
};

export const getCities = (countryId) => async (dispatch) => {
  try {
    dispatch({ type: GET_CITIES_REQUEST });

    const response = await fetch(`/api/location/cities?country=${countryId}`);
    const data = await response.json();

    dispatch({
      type: GET_CITIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CITIES_FAIL,
      payload: error.message || "Cities could not be loaded.",
    });
  }
};

export const getDistricts = (cityId) => async (dispatch) => {
  try {
    dispatch({ type: GET_DISTRICTS_REQUEST });

    const response = await fetch(`/api/location/districts?city=${cityId}`);
    const data = await response.json();

    dispatch({
      type: GET_DISTRICTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_DISTRICTS_FAIL,
      payload: error.message || "Districts could not be loaded.",
    });
  }
};
