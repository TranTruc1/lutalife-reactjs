import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxpxLvR8v580_pSObdABIXxyTg8ag4PCiQwqbsRl71ekq2BlH_D1g6q5Gdu2pJMeIb_/exec";

export default function ProductOrderForm({ product, quantity, onClose }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const [formData, setFormData] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [countdown, setCountdown] = useState(5);

  // Lấy IP thực
  const [ip, setIp] = useState("unknown");
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => {});
  }, []);

  // Countdown khi success
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const total = formatCurrency(product.price * quantity);
    const payload = {
      product: `${product.title} (x${quantity}) — ${total}`,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      payment: formData.note || "—",
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
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-[90%] md:w-[60%] max-w-4xl rounded-3xl bg-white p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">

        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full">
          <IoMdClose size={28} />
        </button>

        <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#031432]">Xác nhận đơn hàng</h2>

        {/* Tóm tắt đơn hàng */}
        <div className="mb-8 bg-[#F2F7FF] p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={product.cover} alt="product" className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200 shadow-sm" />
            <div>
              <p className="font-bold text-[#031432] text-lg line-clamp-1">{product.title}</p>
              <p className="text-sm text-gray-500">Số lượng: <b className="text-black">{quantity}</b></p>
            </div>
          </div>
          <div className="text-right border-t md:border-t-0 border-blue-200 pt-2 md:pt-0">
            <p className="text-sm text-gray-500">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-[#1678F2]">{formatCurrency(product.price * quantity)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Họ và tên</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Ví dụ: John Nguyen"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Số điện thoại</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="(+1) 234 567 890"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Địa chỉ nhận hàng (Tại Mỹ)</label>
            <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="1234 Main St, San Jose, CA 95122, USA"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Ghi chú (Tùy chọn)</label>
            <textarea name="note" value={formData.note} onChange={handleChange} rows="3" placeholder="Lời nhắn cho người bán..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all resize-none" />
          </div>

          <button type="submit" disabled={status === "loading"}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed">
            Xác nhận đặt hàng
          </button>

          {status === "error" && (
            <p className="text-center text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
              ❌ Có lỗi xảy ra, vui lòng kiểm tra lại kết nối.
            </p>
          )}
        </form>
      </div>

      {/* Loading Overlay */}
      {status === "loading" && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 shadow-lg" />
          <div className="text-xl font-bold text-blue-800 animate-pulse">Đang xử lý đơn hàng...</div>
          <p className="text-gray-500 mt-2 text-sm">Vui lòng không đóng trình duyệt</p>
        </div>
      )}

      {/* Success Modal */}
      {status === "success" && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping" />
              <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Đặt Thành Công!</h3>
            <p className="text-gray-600 font-medium mb-6">
              Cảm ơn bạn đã tin tưởng LUTA LIFE.<br />Chúng tôi sẽ liên hệ sớm nhất để xác nhận.
            </p>
            <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-500">
              Tự động đóng sau <span className="font-bold text-red-500 text-base">{countdown}</span> giây
            </div>
          </div>
        </div>
      )}
    </div>
  );
}