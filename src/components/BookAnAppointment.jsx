import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./BookForm.css";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxpxLvR8v580_pSObdABIXxyTg8ag4PCiQwqbsRl71ekq2BlH_D1g6q5Gdu2pJMeIb_/exec";

export default function BookAnAppointment({ onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(5);
  const [ip, setIp] = useState("unknown");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer;
    if (status === "success") {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [status]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

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
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Form chính */}
      <div className="overlay">
        <form onSubmit={handleSubmit} className="book-form">
          <button type="button" className="form-close" onClick={onClose}>✕</button>
          <h2 className="form-title">Đặt lịch khám</h2>

          <input
            type="text" name="name" placeholder="Họ và tên"
            value={form.name} onChange={handleChange} required
          />
          <input
            type="text" name="phone" placeholder="Số điện thoại"
            value={form.phone} onChange={handleChange} required
          />
          <input
            type="text" name="address" placeholder="Địa chỉ"
            value={form.address} onChange={handleChange}
          />
          <textarea
            name="note" placeholder="Ghi chú"
            value={form.note} onChange={handleChange}
          />

          <button type="submit" className="form-submit">Gửi thông tin</button>

          {status === "error" && (
            <p style={{ color: "red", textAlign: "center", fontSize: "0.9rem" }}>
              ❌ Không kết nối được, vui lòng thử lại.
            </p>
          )}
        </form>
      </div>

      {/* Loading — portal thẳng vào body */}
      {status === "loading" && createPortal(
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            width: 56, height: 56,
            border: "4px solid #bfdbfe", borderTopColor: "#2563eb",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
            marginBottom: 16
          }} />
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1e40af" }}>
            Đang xử lý...
          </div>
          <p style={{ color: "#6b7280", marginTop: 8, fontSize: "0.85rem" }}>
            Vui lòng không đóng trình duyệt
          </p>
        </div>,
        document.body
      )}

      {/* Success Modal — portal thẳng vào body */}
      {status === "success" && createPortal(
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 16
        }}>
          <div style={{
            background: "white", borderRadius: 24, padding: 32,
            maxWidth: 360, width: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              position: "relative", width: 96, height: 96,
              marginBottom: 24,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "#4ade80", borderRadius: "50%",
                opacity: 0.2, animation: "ping 1s ease infinite"
              }} />
              <div style={{
                width: 80, height: 80, background: "#dcfce7",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width={40} height={40} fill="none" stroke="#16a34a" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 8 }}>
              Gửi Thành Công!
            </h3>
            <p style={{ color: "#4b5563", fontWeight: 500, marginBottom: 24 }}>
              Cảm ơn bạn. Chúng tôi sẽ liên hệ sớm nhất để xác nhận lịch hẹn.
            </p>
            <div style={{
              background: "#f9fafb", padding: "8px 20px",
              borderRadius: 999, border: "1px solid #e5e7eb",
              fontSize: "0.875rem", color: "#6b7280"
            }}>
              Tự động đóng sau{" "}
              <span style={{ fontWeight: 700, color: "#ef4444", fontSize: "1rem" }}>
                {countdown}
              </span>{" "}
              giây
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}