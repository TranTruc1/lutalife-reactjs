import React, { useState, useEffect } from "react";
import "./BookForm.css";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxpxLvR8v580_pSObdABIXxyTg8ag4PCiQwqbsRl71ekq2BlH_D1g6q5Gdu2pJMeIb_/exec";

async function getClientIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "unknown";
  }
}

function BookAnAppointment({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    console.log("📌 Form đã hiển thị");
    return () => console.log("📌 Form đã bị ẩn");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const ip = await getClientIP();

    const payload = {
      product: "Đặt lịch khám",
      name: form.name,
      phone: form.phone,
      address: form.address || "—",
      payment: form.note || "—",
      ip,
    };

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      setTimeout(() => {
        setForm({ name: "", phone: "", address: "", note: "" });
        onClose();
      }, 2500);
    } catch (err) {
      console.error("❌ Lỗi gửi form", err);
      setStatus("error");
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

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3rem" }}>✅</div>
            <p style={{ fontWeight: "bold", color: "#16a34a", marginTop: "0.5rem" }}>
              Gửi thành công!
            </p>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>
              Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
          </div>
        ) : (
          <>
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
            <button
              type="submit"
              className="form-submit"
              disabled={status === "loading"}
              style={status === "loading" ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            >
              {status === "loading" ? "Đang gửi..." : "Gửi thông tin"}
            </button>
            {status === "error" && (
              <p style={{ color: "red", textAlign: "center", fontSize: "0.9rem" }}>
                ❌ Không kết nối được, vui lòng thử lại.
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default BookAnAppointment;