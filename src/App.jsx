import React, { useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ListItems from "./components/ListItems";
import About from "./components/About";
import Services from "./components/Services";
import ServiceCards from "./components/ServiceCards";
import VideoSection from "./components/VideoSection";
import Login from "./components/Login";

// Trang admin
import AdminUsers from "./components/AdminUsers";
import AdminAppointments from "./components/AppointmentsPage";

function MainPage() {
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      <Navbar
        aboutRef={aboutRef}
        servicesRef={servicesRef}
        contactRef={contactRef}
      />
      <div className="bg-[#F2F7FF]">
        <Hero />
        <ListItems />
      </div>

      <div ref={aboutRef}>
        <About />
      </div>

      <div className="bg-[#F2F7FF]" ref={servicesRef}>
        <Services />
        <ServiceCards />
      </div>

      <div ref={contactRef}>
        <VideoSection />
      </div>
    </>
  );
}

// ✅ Component bảo vệ route
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={(data) => {
                setUser(data);
              }}
            />
          }
        />

        {/* ✅ Bọc route admin bằng PrivateRoute */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <PrivateRoute>
              <AdminAppointments />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
