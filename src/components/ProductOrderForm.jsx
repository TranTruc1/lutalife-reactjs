import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "./api";
import { IoMdClose } from "react-icons/io";

export default function ProductOrderForm({ product, quantity, onClose }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "", 
  });

  const [status, setStatus] = useState("idle");
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // ✅ 1. Fix lỗi trượt màn hình nền
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSafe = () => {
    const hasData = formData.name.trim() || formData.phone.trim() || formData.address.trim() || formData.notes.trim();
    if (hasData && status !== "success") {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // ✅ 2. QUAN TRỌNG: Ghép thông tin sản phẩm vào 'note'
    const orderDetails = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      service: "ĐẶT HÀNG ONLINE",
      date: new Date().toISOString().split('T')[0],
      // Dòng này đảm bảo Admin thấy được khách đặt cái gì
      note: `Sản phẩm: ${product.title} (x${quantity})\nTổng tiền: ${formatCurrency(product.price * quantity)}\nĐịa chỉ giao hàng: ${formData.address}\nGhi chú thêm: ${formData.notes}`
    };

    try {
      await axios.post(`${API_BASE}/api/appointments`, orderDetails);
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Lỗi gửi đơn:", error);
      setStatus("error");
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-300"
        onClick={handleCloseSafe}
      >
        <div 
          // ✅ Popup 80% màn hình PC
          className="relative w-[95%] md:w-[80%] rounded-[2rem] bg-white p-6 md:p-12 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh] border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleCloseSafe} 
            className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full group"
          >
            <IoMdClose size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <h2 className="mb-2 text-center text-3xl md:text-4xl font-bold text-[#031432] tracking-tight">
            Xác nhận đơn hàng
          </h2>
          <p className="text-center text-gray-500 mb-8">Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất</p>
          
          {/* Thông tin sản phẩm (Chỉ hiển thị, logic gửi nằm ở handleSubmit) */}
          <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-inner">
            <div className="flex items-center gap-5">
               <div className="p-2 bg-white rounded-2xl shadow-sm border border-blue-100">
                 <img src={product.cover} alt="product" className="w-20 h-20 object-cover rounded-xl" />
               </div>
               <div>
                  <p className="font-bold text-[#031432] text-lg md:text-xl line-clamp-1">{product.title}</p>
                  <p className="text-sm text-gray-600 mt-1">Số lượng: <b className="text-[#1678F2] text-lg">{quantity}</b></p>
               </div>
            </div>
            <div className="text-right border-t md:border-t-0 border-blue-200 pt-4 md:pt-0 pl-0 md:pl-6">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Tổng thanh toán</p>
              <p className="text-3xl font-extrabold text-[#1678F2] mt-1">{formatCurrency(product.price * quantity)}</p>
            </div>
          </div>

          {status === "success" ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-bounce">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-green-700 mb-3">Đặt hàng thành công!</h3>
              <p className="text-gray-600 text-lg">Cảm ơn bạn đã tin tưởng LUTA LIFE.<br/>Chúng tôi sẽ liên hệ sớm nhất để xác nhận.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Họ và tên</label>
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Ví dụ: John Nguyen" 
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
                    />
                  </div>

                  <div className="group">
                    <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Số điện thoại</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="(+1) 234 567 890" 
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
                    />
                  </div>
              </div>

              <div className="group">
                <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Địa chỉ nhận hàng (Tại Mỹ)</label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="1234 Main St, San Jose, CA 95122, USA" 
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
                />
              </div>

              <div className="group">
                <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Ghi chú (Tùy chọn)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Lời nhắn cho người bán..." 
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all resize-none placeholder-gray-400"
                ></textarea>
              </div>

              <button disabled={status === "loading"} type="submit" className="mt-4 w-full rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]">
                {status === "loading" ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>

              {status === "error" && (
                <p className="text-center text-sm font-medium text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">❌ Có lỗi xảy ra, vui lòng kiểm tra lại kết nối.</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* POPUP XÁC NHẬN - Nút 50% width trên PC */}
      {showConfirmClose && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirmClose(false)} 
        >
          <div 
            className="bg-white p-8 rounded-3xl shadow-2xl w-[95%] md:w-[80%] text-center scale-100 animate-pop-in border border-gray-100"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hủy đơn hàng?</h3>
            <p className="text-gray-500 mb-8">Thông tin bạn vừa nhập sẽ bị mất. Bạn có chắc chắn muốn thoát không?</p>
            
            <div className="flex gap-3 justify-center w-full md:w-1/2 mx-auto">
              <button 
                onClick={() => { setShowConfirmClose(false); onClose(); }} 
                className="flex-1 px-5 py-3 rounded-xl bg-red-50 font-bold text-red-500 hover:bg-red-100 border border-red-100 transition-colors"
              >
                Hủy & Thoát
              </button>

              <button 
                onClick={() => setShowConfirmClose(false)} 
                className="flex-1 px-5 py-3 rounded-xl bg-[#1678F2] font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                Tiếp Tục
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}