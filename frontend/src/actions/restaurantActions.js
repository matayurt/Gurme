import axios from "axios";
import {
  RESTAURANT_ADD_REQUEST,
  RESTAURANT_ADD_SUCCESS,
  RESTAURANT_ADD_FAIL,
  RESTAURANT_LIST_REQUEST,
  RESTAURANT_LIST_SUCCESS,
  RESTAURANT_LIST_FAIL,
  RESTAURANT_DELETE_REQUEST,
  RESTAURANT_DELETE_SUCCESS,
  RESTAURANT_DELETE_FAIL,
  RESTAURANT_UPDATE_REQUEST,
  RESTAURANT_UPDATE_SUCCESS,
  RESTAURANT_UPDATE_FAIL,
  RESTAURANT_DETAILS_REQUEST,
  RESTAURANT_DETAILS_SUCCESS,
  RESTAURANT_DETAILS_FAIL,
} from "../constants/restaurantConstants";

export const addRestaurant = (restaurantData) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:5001/api/restaurants",
      restaurantData,
      config
    );

    dispatch({ type: RESTAURANT_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RESTAURANT_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRestaurants = () => async (dispatch) => {
  try {
    dispatch({ type: RESTAURANT_LIST_REQUEST });
    const { data } = await axios.get("http://localhost:5001/api/restaurants");
    console.log("Fetched Restaurants: ", data);

    dispatch({
      type: RESTAURANT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RESTAURANT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteRestaurant = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`http://localhost:5001/api/restaurants/${id}`, config);

    dispatch({ type: RESTAURANT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: RESTAURANT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateRestaurant =
  (restaurantData, id) => async (dispatch, getState) => {
    try {
      dispatch({ type: RESTAURANT_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5001/api/restaurants/${id}`,
        restaurantData,
        config
      );

      dispatch({ type: RESTAURANT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: RESTAURANT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getRestaurantDetails = (restaurantId) => async (dispatch) => {
  try {
    dispatch({ type: RESTAURANT_DETAILS_REQUEST });

    const { data } = await axios.get(
      `http://localhost:5001/api/restaurants/${restaurantId}`
    );

    dispatch({
      type: RESTAURANT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RESTAURANT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const incrementRestaurantViewCount =
  (restaurantId) => async (dispatch) => {
    try {
      await axios.put(
        `http://localhost:5001/api/restaurants/${restaurantId}/view`
      );
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  };
