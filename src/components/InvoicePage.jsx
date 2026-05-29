import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function InvoicePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Nếu truy cập thẳng URL mà không có data → về trang chủ
  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
        <p className="text-gray-500">Không tìm thấy đơn hàng.</p>
        <Link to="/" className="text-[#1678F2] font-semibold underline">Về trang chủ</Link>
      </div>
    );
  }

  const { orderId, customer, product, quantity, total, orderedAt } = state;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10 md:py-16">

        {/* Badge thành công */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping" />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Đặt hàng thành công!</h1>
          <p className="text-gray-500 text-sm mt-1">Chúng tôi sẽ liên hệ sớm nhất để xác nhận.</p>
        </div>

        {/* Card hoá đơn */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header hoá đơn */}
          <div className="bg-gradient-to-r from-[#65A8FB] to-[#1678F2] px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Mã đơn hàng</p>
              <p className="text-white text-xl font-bold tracking-widest mt-0.5">#{orderId}</p>
            </div>
            <img src="/logo.png" alt="Logo" className="h-10 object-contain brightness-0 invert opacity-90" />
          </div>

          {/* Sản phẩm */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
            <img src={product.cover} alt="product" className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-gray-50 shadow-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#031432] leading-tight line-clamp-2">{product.title}</p>
              <p className="text-sm text-gray-400 mt-1">Số lượng: <span className="font-semibold text-gray-700">{quantity}</span></p>
            </div>
          </div>

          {/* Thông tin khách */}
          <div className="px-6 py-5 flex flex-col gap-3 border-b border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thông tin người nhận</p>
            <Row label="Họ tên" value={customer.name} />
            <Row label="Điện thoại" value={customer.phone} />
            <Row label="Địa chỉ" value={customer.address} />
            {customer.note && <Row label="Ghi chú" value={customer.note} />}
            <Row label="Thời gian" value={formatDate(orderedAt)} />
          </div>

          {/* Tổng tiền */}
          <div className="px-6 py-5 flex items-center justify-between bg-[#F2F7FF]">
            <span className="text-gray-600 font-semibold">Tổng thanh toán</span>
            <span className="text-2xl font-extrabold text-[#1678F2]">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Lưu ý */}
        <p className="text-center text-xs text-gray-400 mt-5 px-4">
          Đội ngũ LUTA LIFE sẽ gọi xác nhận đơn hàng trong vòng <b className="text-gray-600">24 giờ</b>. Nếu cần hỗ trợ, liên hệ <b className="text-gray-600">+1 281-675-2886</b>.
        </p>

        {/* Nút */}
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={() => window.print()}
            className="w-full py-3.5 rounded-full border-2 border-[#1678F2] text-[#1678F2] font-bold text-base transition hover:bg-[#F2F7FF]"
          >
            🖨️ In hoá đơn
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] text-white font-bold text-base shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
    </div>
  );
}