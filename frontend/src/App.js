import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import HomeScreen from "./components/HomeScreen";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./admin/AdminDashboard";
import Restaurants from "./components/Restaurants";
import RestaurantScreen from "./components/RestaurantScreen";
import Footer from "./components/Footer";
import RecommendationHome from "./components/RecommendationHome";
import Contact from "./components/Contact";
import MyWritings from "./components/MyWritings";
import MyTrips from "./components/MyTrips";
import WritingScreen from "./components/WritingScreen";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { UserProvider } from "./context/UserContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

import "./input.css";

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const location = useLocation();

  const isOnAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <UserProvider>
        {!isOnAdminRoute && <Navbar />}

        <Routes>
          <Route path="/" exact element={<HomeScreen />} />
          <Route path="/recommendations" element={<RecommendationHome />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mywritings" element={<MyWritings />} />
          <Route path="writings/:id" element={<WritingScreen />} />
          <Route path="/mytrips" element={<MyTrips />} />
          <Route path="/restaurants" exact element={<Restaurants />} />
          <Route
            path="/restaurant/:restaurantId"
            element={<RestaurantScreen />}
          />
          <Route path="/mehmet123" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/resetpassword/:token" element={<ResetPasswordForm />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>

        {!isOnAdminRoute && <Footer />}
      </UserProvider>
    </>
  );
}

export default App;
