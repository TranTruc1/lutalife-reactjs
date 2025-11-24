import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { API_BASE } from "./components/api";

// --- Import các trang con ---
import ServiceDetail from "./components/ServiceDetail";
import ProductDetail from "./components/ProductDetail"; // ✅ Import trang chi tiết sản phẩm mới

// --- Import các thành phần giao diện ---
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ListItems from "./components/ListItems";
import About from "./components/About";
import Services from "./components/Services";
import ServiceCards from "./components/ServiceCards";
import VideoSection from "./components/VideoSection";
import ProductList from "./components/ProductList"; // ✅ Import danh sách sản phẩm
import Login from "./components/Login";

// --- Import trang Admin ---
import AdminUsers from "./components/AdminUsers";
import AdminAppointments from "./components/AppointmentsPage";
import Editor from "./components/Editor";

// 1️⃣ Component Trang Chủ (Landing Page)
function MainPage() {
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);
  // Có thể thêm ref cho Products nếu muốn scroll tới đó
  const productsRef = useRef(null); 

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

      {/* ✅ Thêm danh sách sản phẩm vào đây */}
      <div ref={productsRef} className="bg-white">
        <ProductList />
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

// 2️⃣ Component bảo vệ route Admin
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// 3️⃣ App chính
function App() {
  const [user, setUser] = useState(null);

  // Wake up backend khi FE load (Ping server)
  useEffect(() => {
    if (API_BASE) {
      axios
        .get(API_BASE + "/api/ping")
        .then(() => console.log("✅ Backend woke up."))
        .catch(() => console.warn("⚠️ Backend not responding yet"));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- ROUTE CÔNG KHAI --- */}
        
        {/* Trang chủ */}
        <Route path="/" element={<MainPage />} />
        
        {/* ✅ Route riêng cho SẢN PHẨM (Mua hàng) */}
        {/* Ví dụ: /product/combo-luta-life-3-hop */}
        <Route path="/product/:slug" element={<ProductDetail />} />

        {/* Route cho DỊCH VỤ / BÀI VIẾT TIN TỨC (Đọc tin) */}
        {/* Lưu ý: Để route này sau cùng trong nhóm public để tránh conflict */}
        <Route path="/:slug" element={<ServiceDetail />} />

        {/* Route ẩn/Test */}
        <Route path="/ngungonzzxz" element={<Editor />} />
        
        {/* Login */}
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

        {/* --- ROUTE ADMIN (Bảo vệ bằng PrivateRoute) --- */}
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