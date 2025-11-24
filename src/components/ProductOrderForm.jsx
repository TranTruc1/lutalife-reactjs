import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "./api";
import { IoMdClose } from "react-icons/io";

export default function ProductOrderForm({ product, quantity, onClose }) {
  // Format tiền tệ USD
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "", // Thêm trường địa chỉ
    note: "",
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // Tạo nội dung đơn hàng gửi về backend/email
    const orderDetails = {
      ...formData,
      service: "ĐẶT HÀNG ONLINE", // Đánh dấu loại dịch vụ
      date: new Date().toISOString().split('T')[0],
      // Gộp thông tin chi tiết vào ghi chú để Admin dễ xem
      note: `Sản phẩm: ${product.title} (x${quantity}), \nTổng tiền: ${formatCurrency(product.price * quantity)},\nĐịa chỉ giao hàng: ${formData.address},\nGhi chú thêm: ${formData.note}`
    };

    try {
      await axios.post(`${API_BASE}/api/appointments`, orderDetails);
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* ✅ SỬA UI: 
          - w-[90%]: Mobile chiếm 90%
          - md:w-[60%]: Laptop chiếm 60%
          - max-w-4xl: Giới hạn tối đa
          - rounded-3xl: Bo góc lớn hơn
      */}
      <div className="relative w-[90%] md:w-[60%] max-w-4xl rounded-3xl bg-white p-6 md:p-10 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh]">
        
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full">
          <IoMdClose size={28} />
        </button>

        <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-[#031432]">Xác nhận đơn hàng</h2>
        
        {/* Tóm tắt đơn hàng - Thêm ảnh và style lại */}
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

        {status === "success" ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-bounce">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Đặt hàng thành công!</h3>
            <p className="text-gray-600 text-lg">Cảm ơn bạn đã tin tưởng LUTA LIFE.<br/>Chúng tôi sẽ liên hệ sớm nhất để xác nhận.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid 2 cột cho Tên & SĐT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Họ và tên</label>
                  {/* ✅ SỬA UI: Input to hơn, padding dày hơn, background nhẹ */}
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Ví dụ: John Nguyen" 
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" 
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Số điện thoại</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="(+1) 234 567 890" 
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" 
                  />
                </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Địa chỉ nhận hàng (Tại Mỹ)</label>
              {/* ✅ SỬA: Placeholder địa chỉ Mỹ */}
              <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="1234 Main St, San Jose, CA 95122, USA" 
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all" 
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 uppercase tracking-wide">Ghi chú (Tùy chọn)</label>
              <textarea name="note" value={formData.note} onChange={handleChange} rows="3" placeholder="Lời nhắn cho người bán..." 
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all resize-none"
              ></textarea>
            </div>

            <button disabled={status === "loading"} type="submit" className="mt-4 w-full rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed">
              {status === "loading" ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>

            {status === "error" && (
              <p className="text-center text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">❌ Có lỗi xảy ra, vui lòng kiểm tra lại kết nối.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}