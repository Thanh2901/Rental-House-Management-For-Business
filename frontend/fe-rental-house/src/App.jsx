import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ForgotPassword from "./component/auth/ForgotPassword.jsx";
import LoginPage from "./component/auth/LoginPage.jsx";
import RegisterPage from "./component/auth/Register.jsx";
import AllRoomPage from "./component/booking_rooms/AllRoomPage.jsx";
import RoomDetailsPage from "./component/booking_rooms/RoomDetailsPage.jsx";
import Footer from "./component/common/Footer.jsx";
import Navbar from "./component/common/Navbar.jsx";
import HomePage from "./component/home/HomePage.jsx";
import LandingPage from "./component/landing/LandingPage.jsx";

import AssetsPage from "./component/profile/ChildrenPage/AssetsPage/index.jsx";
import ChangePasswordPage from "./component/profile/ChildrenPage/ChangePasswordPage/index.jsx";
import PaymentHistoryPage from "./component/profile/ChildrenPage/PaymentHistoryPage/index.jsx";
import RentalHistoryPage from "./component/profile/ChildrenPage/RentalHistoryPage/index.jsx";
import UserProfilePage from "./component/profile/ChildrenPage/UserProfilePage/index.jsx";
import UserProfile from "./component/profile/UserProfile.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="bottom-right" closeButton={false} />
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<UserProfile />}>
              <Route path="" element={<UserProfilePage />} />
              <Route path="rental-history" element={<RentalHistoryPage />} />
              <Route path="payment-history" element={<PaymentHistoryPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="assets" element={<AssetsPage />} />
            </Route>
            <Route path="/rooms" element={<AllRoomPage />} />
            <Route
              path={"/room-details/:roomId"}
              element={<RoomDetailsPage />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
