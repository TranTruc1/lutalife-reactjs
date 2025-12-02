import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./api";
import Navbar from "./Navbar";

function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // ✅ State cho checkbox
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Kiểm tra token & Tự điền thông tin nếu đã "Ghi nhớ"
  useEffect(() => {
    // Check token để redirect (Logic cũ)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/admin/appointments");
      }
    }

    // ✅ Logic mới: Load thông tin đã ghi nhớ
    const savedPhone = localStorage.getItem("savedPhone");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedPhone && savedPassword) {
      setPhone(savedPhone);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Vui lòng nhập đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Gửi login:", { phone, password });

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      console.log("📥 Trạng thái:", res.status, "Phản hồi:", data);

      if (res.ok) {
        // Lưu token
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // ✅ Logic mới: Xử lý Ghi nhớ tài khoản
        if (rememberMe) {
          localStorage.setItem("savedPhone", phone);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedPhone");
          localStorage.removeItem("savedPassword");
        }

        onLogin?.(data);

        // Chuyển hướng
        if (data.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/admin/appointments");
        }
      } else {
        alert(data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("⚠️ Lỗi kết nối:", err);
      alert("⚠️ Không kết nối được server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Đăng nhập
          </h2>

          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* ✅ Checkbox Ghi nhớ tài khoản */}
          <div className="flex items-center mb-6">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Ghi nhớ tài khoản & mật khẩu
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;