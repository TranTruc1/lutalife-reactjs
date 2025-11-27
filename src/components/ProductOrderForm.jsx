import React, { useState, useEffect } from "react";
import { API_BASE } from "./api";
import { IoMdClose } from "react-icons/io";

export default function BookAnAppointment({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  
  // State hiện popup xác nhận đóng
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // ✅ FIX BUG: Khóa cuộn trang web (body) khi popup mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Hàm kiểm tra dữ liệu trước khi đóng form
  const handleCloseSafe = () => {
    const hasData = form.name.trim() || form.phone.trim() || form.address.trim() || form.note.trim();
    if (hasData) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...form,
      service: "ĐẶT LỊCH KHÁM",
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        alert("✅ Đặt lịch thành công! Chúng tôi sẽ liên hệ sớm.");
        setForm({ name: "", phone: "", address: "", note: "" });
        onClose();
      } else {
        const err = await res.json();
        alert("❌ Lỗi: " + (err.message || "Không gửi được"));
      }
    } catch (err) {
      console.error("❌ Lỗi gửi form", err);
      alert("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- FORM CHÍNH --- */}
      <div 
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-300"
        onClick={handleCloseSafe}
      >
        <div 
          className="relative w-[95%] md:w-[60%] max-w-4xl rounded-[2rem] bg-white p-6 md:p-12 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh] border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleCloseSafe} 
            className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full group"
          >
            <IoMdClose size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <h2 className="mb-2 text-center text-3xl md:text-4xl font-bold text-[#031432] tracking-tight">
            Đặt lịch tư vấn
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ lại ngay.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Họ và tên</label>
                  <input required name="name" value={form.name} onChange={handleChange} type="text" placeholder="Ví dụ: John Nguyen" 
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
                  />
                </div>

                <div className="group">
                  <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Số điện thoại</label>
                  <input required name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="(+1) 234 567 890" 
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
                  />
                </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Địa chỉ (Tùy chọn)</label>
              <input name="address" value={form.address} onChange={handleChange} type="text" placeholder="Thành phố, Bang..." 
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all placeholder-gray-400" 
              />
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wide group-focus-within:text-[#1678F2] transition-colors">Vấn đề cần tư vấn</label>
              <textarea name="note" value={form.note} onChange={handleChange} rows="3" placeholder="Tôi đang bị cao huyết áp..." 
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:border-[#1678F2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1678F2]/10 transition-all resize-none placeholder-gray-400"
              ></textarea>
            </div>

            <button disabled={loading} type="submit" className="mt-4 w-full rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]">
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
      </div>

      {/* --- POPUP XÁC NHẬN ĐÓNG --- */}
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hủy đăng ký?</h3>
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