import { combineReducers } from "redux";
import { foodDetailsReducer } from "./foodReducers";

const rootReducer = combineReducers({
  foodDetails: foodDetailsReducer,
});

export default rootReducer;
