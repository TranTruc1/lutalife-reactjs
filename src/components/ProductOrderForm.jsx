import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxpxLvR8v580_pSObdABIXxyTg8ag4PCiQwqbsRl71ekq2BlH_D1g6q5Gdu2pJMeIb_/exec";

export default function ProductOrderForm({ product, quantity, onClose }) {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const [formData, setFormData] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState("idle");
  const [ip, setIp] = useState("unknown");

  const lockedHeight = useRef(
    typeof window !== "undefined" ? Math.round(window.innerHeight * 0.92) : 600
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBackdropClick = () => {
    const hasData = Object.values(formData).some((v) => v.trim() !== "");
    if (hasData) {
      if (window.confirm("Bạn đã nhập thông tin. Bạn có chắc muốn đóng không?")) onClose();
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const orderId = `LU${Date.now().toString().slice(-8)}`;
    const total = formatCurrency(product.price * quantity);

    const payload = {
      product: `${product.title} (x${quantity}) — ${total} - Mã ĐH: #${orderId}`,
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

      navigate("/invoice", {
        state: {
          orderId,
          customer: formData,
          product: { title: product.title, cover: product.cover, price: product.price },
          quantity,
          total: product.price * quantity,
          orderedAt: new Date().toISOString(),
        },
      });
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1678F2]/10 transition-all";

  return (
    <>
      <div
        className="fixed inset-0 z-[999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          className="relative w-full md:w-[60%] md:max-w-2xl bg-white rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
          style={{ height: lockedHeight.current }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-[#031432]">Xác nhận đơn hàng</h2>
            <button
              onClick={handleBackdropClick}
              className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Tóm tắt sản phẩm */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-[#F2F7FF] border-b border-blue-100 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={product.cover} alt="product"
                className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white shadow-sm shrink-0"
              />
              <div>
                <p className="font-bold text-[#031432] text-sm leading-tight line-clamp-1">{product.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">Số lượng: <b className="text-black">{quantity}</b></p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tổng</p>
              <p className="text-lg font-bold text-[#1678F2] leading-tight">{formatCurrency(product.price * quantity)}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5 py-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Họ và tên</label>
                <input
                  required name="name" value={formData.name} onChange={handleChange}
                  type="text" placeholder="John Nguyen"
                  className={inputCls} style={{ fontSize: 16 }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Điện thoại</label>
                <input
                  required name="phone" value={formData.phone} onChange={handleChange}
                  type="tel" placeholder="(+1) 234 567 890"
                  className={inputCls} style={{ fontSize: 16 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Địa chỉ nhận hàng (USA)</label>
              <input
                required name="address" value={formData.address} onChange={handleChange}
                type="text" placeholder="1234 Main St, San Jose, CA 95122"
                className={inputCls} style={{ fontSize: 16 }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Ghi chú (tùy chọn)</label>
              <textarea
                name="note" value={formData.note} onChange={handleChange}
                rows={2} placeholder="Lời nhắn cho người bán..."
                className={`${inputCls} resize-none`} style={{ fontSize: 16 }}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              Xác nhận đặt hàng
            </button>

            {status === "error" && (
              <p className="text-center text-xs font-medium text-red-500 bg-red-50 p-2.5 rounded-lg">
                ❌ Có lỗi xảy ra, vui lòng kiểm tra lại kết nối.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Loading */}
      {status === "loading" && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)" }}>
          <div style={{ width: 52, height: 52, border: "4px solid #bfdbfe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 14 }} />
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1e40af" }}>Đang xử lý đơn hàng...</div>
          <p style={{ color: "#6b7280", marginTop: 6, fontSize: "0.8rem" }}>Vui lòng không đóng trình duyệt</p>
        </div>,
        document.body
      )}
    </>
  );
}