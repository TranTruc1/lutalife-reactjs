import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ServiceDetail from "./components/ServiceDetail";
import ProductDetail from "./components/ProductDetail";
import InvoicePage from "./components/InvoicePage";
import Editor from "./components/Editor";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ListItems from "./components/ListItems";
import About from "./components/About";
import Services from "./components/Services";
import ServiceCards from "./components/ServiceCards";
import VideoSection from "./components/VideoSection";
import ProductList from "./components/ProductList";
import { scrollToSection } from "./components/scroll";

// Trang chủ. Mỗi khối có id để menu cuộn tới, kể cả khi bấm menu từ trang khác.
function MainPage() {
  const { state } = useLocation();

  useEffect(() => {
    if (state?.scrollTo) {
      // đợi ảnh/khối render xong rồi mới cuộn
      const t = setTimeout(() => scrollToSection(state.scrollTo), 120);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="relative w-full overflow-x-hidden">
      <Navbar />

      <div className="bg-[#F2F7FF]">
        <Hero />
        <ListItems />
      </div>

      <div id="san-pham" className="bg-white">
        <ProductList />
      </div>

      <div id="gioi-thieu">
        <About />
      </div>

      <div id="dich-vu" className="bg-[#F2F7FF]">
        <Services />
        <ServiceCards />
      </div>

      <div id="lien-he">
        <VideoSection />
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Dọn mật khẩu từng được lưu dạng chữ thường bởi trang đăng nhập cũ (đã gỡ).
    try {
      ["savedPassword", "savedPhone", "token", "role"].forEach((k) =>
        localStorage.removeItem(k),
      );
    } catch {
      /* trình duyệt chặn localStorage: bỏ qua */
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/invoice" element={<InvoicePage />} />
        {/* Công cụ soạn nội dung JSON nội bộ (không gửi dữ liệu đi đâu) */}
        <Route path="/ngungonzzxz" element={<Editor />} />
        {/* Bài viết dịch vụ: /:slug khớp sau cùng nhờ cơ chế xếp hạng route */}
        <Route path="/:slug" element={<ServiceDetail />} />
      </Routes>
    </Router>
  );
}
