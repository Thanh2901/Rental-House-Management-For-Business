import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/common/Navbar.jsx";
import Footer from "./component/common/Footer.jsx";
import RegisterPage from "./component/auth/Register.jsx";
import LoginPage from "./component/auth/LoginPage.jsx";
import ForgotPassword from "./component/auth/ForgotPassword.jsx";
import RoomSearch from "./component/common/RoomSearch.jsx";
import RoomResult from "./component/common/RoomResult.jsx";
import HomePage from "./component/home/HomePage.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./component/profile/UserProfile.jsx";
import LandingPage from "./component/landing/LandingPage.jsx";
import AllRoomPage from "./component/booking_rooms/AllRoomPage.jsx";
import RoomDetailsPage from "./component/booking_rooms/RoomDetailsPage.jsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <BrowserRouter>
            <div className="App">
                <ToastContainer
                    position="bottom-right"
                    closeButton={false}
                />
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/rooms" element={<AllRoomPage/>}/>
                        <Route path={"/room-details/:roomId"} element={<RoomDetailsPage/>}/>
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;