import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer from "./reducers/userLoginSlice";
import userRegisterReducer from "./reducers/userRegisterSlice";
import {
  commentListReducer,
  commentApproveReducer,
  commentDeleteReducer,
  commentUnapprovedReducer,
  commentApprovedReducer,
  newCommentsReducer,
  commentApprovedListReducer,
  commentAddReducer,
} from "./reducers/commentReducers";
import {
  userRegisterAdminReducer,
  userListReducer,
  userUpdateReducer,
  userDeleteReducer,
  userProfileReducer,
  userForgotPasswordReducer,
  userResetPasswordReducer,
} from "./reducers/userReducers";
import categoryReducer from "./reducers/categorySlice";
import { categoryListReducer } from "./reducers/categoryReducers";
import { locationReducer } from "./reducers/locationReducers";
import {
  restaurantAddReducer,
  restaurantListReducer,
  restaurantFoodsReducer,
  restaurantDetailsReducer,
} from "./reducers/restaurantReducer";
import {
  questionListReducer,
  questionAddReducer,
  questionDeleteReducer,
  questionEditReducer,
} from "./reducers/questionReducers";
import { socialLinksReducer } from "./reducers/socialReducers";
import { gurmeDetailReducer } from "./reducers/gurmeDetailReducers.js";
import {
  videoAddReducer,
  videoListReducer,
  videoDeleteReducer,
} from "./reducers/videoReducers";
import {
  sliderListReducer,
  sliderAddReducer,
  sliderUpdateReducer,
  sliderDeleteReducer,
} from "./reducers/sliderReducers";
import {
  writingListReducer,
  writingAddReducer,
  writingDeleteReducer,
  writingUpdateReducer,
  writingDetailsReducer,
} from "./reducers/writingReducers.js";
import { replyListReducer } from "./reducers/replyReducers";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userList: userListReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    commentList: commentListReducer,
    commentApprove: commentApproveReducer,
    commentAdd: commentAddReducer,
    commentDelete: commentDeleteReducer,
    newCommentsState: newCommentsReducer,
    commentUnapprovedList: commentUnapprovedReducer,
    commentApprovedList: commentApprovedListReducer,
    categoryList: categoryListReducer,
    locationData: locationReducer,
    restaurantAdd: restaurantAddReducer,
    restaurantList: restaurantListReducer,
    restaurantFoods: restaurantFoodsReducer,
    restaurantDetails: restaurantDetailsReducer,
    userProfile: userProfileReducer,
    userForgotPassword: userForgotPasswordReducer,
    userResetPassword: userResetPasswordReducer,
    questionList: questionListReducer,
    questionAdd: questionAddReducer,
    questionDelete: questionDeleteReducer,
    questionEdit: questionEditReducer,
    socialLinks: socialLinksReducer,
    gurmeDetail: gurmeDetailReducer,
    videoAdd: videoAddReducer,
    videoList: videoListReducer,
    videoDelete: videoDeleteReducer,
    sliderList: sliderListReducer,
    sliderAdd: sliderAddReducer,
    sliderUpdate: sliderUpdateReducer,
    sliderDelete: sliderDeleteReducer,
    writingList: writingListReducer,
    writingAdd: writingAddReducer,
    writingDelete: writingDeleteReducer,
    writingUpdate: writingUpdateReducer,
    writingDetails: writingDetailsReducer,
    restaurantList: restaurantListReducer,
    restaurantDetails: restaurantDetailsReducer,
    commentList: commentListReducer,
    replyList: replyListReducer,
  },
  preloadedState: {
    userLogin: {
      userInfo: userInfoFromStorage,
    },
  },
});

export default store;
