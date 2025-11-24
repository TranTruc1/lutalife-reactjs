import React, { useState, useEffect } from "react";
import { API_BASE } from "./api";   // 👉 import đường dẫn API
import "./BookForm.css"; // ← CSS riêng của bạn

function BookAnAppointment({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    console.log("📌 Form đã hiển thị");
    return () => console.log("📌 Form đã bị ẩn");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Gửi dữ liệu:", form);

    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Gửi thành công!");
        setForm({ name: "", phone: "", address: "", note: "" });
        onClose();
      } else {
        const err = await res.json();
        alert("❌ Lỗi: " + (err.message || "Không gửi được"));
      }
    } catch (err) {
      console.error("❌ Lỗi gửi form", err);
      alert("Không kết nối được server");
    }
  };

  return (
    <div className="overlay">
      <form onSubmit={handleSubmit} className="book-form">
        <button
          type="button"
          className="form-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="form-title">Đặt lịch khám</h2>

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
        />
        <textarea
          name="note"
          placeholder="Ghi chú"
          value={form.note}
          onChange={handleChange}
        />

        <button type="submit" className="form-submit">
          Gửi thông tin
        </button>
      </form>
    </div>
  );
}

export default BookAnAppointment;
