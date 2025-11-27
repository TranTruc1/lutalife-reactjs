import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";
import Navbar from "./Navbar";
import { IoMdClose } from "react-icons/io"; 

function AdminDashboard() {
  const [tab, setTab] = useState("appointments");
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State thêm user mới
  const [newUser, setNewUser] = useState({ phone: "", password: "", role: "editor" });

  // ✅ State cho tính năng SỬA
  const [editingAppointment, setEditingAppointment] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });
  // ✅ Thêm state trạng thái cập nhật để hiển thị thông báo thay vì alert
  const [updateStatus, setUpdateStatus] = useState("idle"); // idle, success, error

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // --- Fetch Data ---
  const fetchUsers = async () => {
    if (role !== "admin") return;
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setAppointments(sortedData);
    } catch (err) {
      console.error("❌ Lỗi load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "appointments") fetchAppointments();
  }, [tab]);

  // --- User Actions ---
  const addUser = async () => {
    try {
      const res = await fetch(API_BASE + "/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });
      if (res.ok) { alert("✅ Thêm user thành công!"); setNewUser({ phone: "", password: "", role: "editor" }); fetchUsers(); }
      else { alert("Lỗi thêm user"); }
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Xóa user này?")) return;
    try {
      const res = await fetch(API_BASE + `/api/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { alert("Đã xóa!"); fetchUsers(); }
    } catch (e) { console.error(e); }
  };

  // --- Appointment Actions ---
  const deleteAppointment = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    try {
      const res = await fetch(API_BASE + `/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("🗑️ Đã xóa lịch hẹn!");
        fetchAppointments();
      } else {
        alert("❌ Lỗi khi xóa lịch hẹn");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 1. Hàm mở form sửa
  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment); 
    setUpdateStatus("idle"); // Reset trạng thái
    setEditFormData({
      name: appointment.name || "",
      phone: appointment.phone || "",
      address: appointment.address || "",
      note: appointment.note || ""
    });
  };

  // ✅ 2. Hàm lưu thay đổi (Đã bỏ Alert)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE + `/api/appointments/${editingAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        // ✅ Hiển thị thông báo thành công trong UI
        setUpdateStatus("success");
        // Tự động đóng sau 1.5s
        setTimeout(() => {
          setEditingAppointment(null);
          setUpdateStatus("idle");
          fetchAppointments(); // Load lại danh sách
        }, 1500);
      } else {
        setUpdateStatus("error");
      }
    } catch (err) {
      console.error(err);
      setUpdateStatus("error");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("vi-VN", {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <Navbar />
      <div className="p-36">
        <div className="flex gap-4 mb-6">
          {role === "admin" && (
            <button onClick={() => setTab("users")} className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Người dùng</button>
          )}
          <button onClick={() => setTab("appointments")} className={`px-4 py-2 rounded ${tab === "appointments" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Lịch hẹn & Đơn hàng</button>
        </div>

        {/* Tab Users */}
        {role === "admin" && tab === "users" && (
           <>
            <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
            <table className="w-full border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100"><th className="border p-2">Phone</th><th className="border p-2">Role</th><th className="border p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td className="border p-2 text-center">{u.phone}</td><td className="border p-2 text-center">{u.role}</td>
                      <td className="border p-2 text-center"><button onClick={() => deleteUser(u._id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button></td>
                    </tr>
                  ))}
                </tbody>
            </table>
            <div className="flex gap-2">
                <input placeholder="SĐT" className="border p-2" onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                <input placeholder="Pass" type="password" className="border p-2" onChange={e => setNewUser({...newUser, password: e.target.value})} />
                <button onClick={addUser} className="bg-green-500 text-white px-4 py-2 rounded">Thêm</button>
            </div>
           </>
        )}

        {/* Tab Lịch hẹn */}
        {tab === "appointments" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Danh sách lịch hẹn</h2>
            {loading ? <p>⏳ Đang tải...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border p-2">Tên</th>
                      <th className="border p-2">SĐT</th>
                      <th className="border p-2">Địa chỉ</th>
                      <th className="border p-2 w-1/3">Ghi chú</th>
                      <th className="border p-2">Ngày gửi</th>
                      {role === "admin" && <th className="border p-2 text-center">Hành động</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50">
                        <td className="border p-2 font-medium">{a.name}</td>
                        <td className="border p-2">{a.phone}</td>
                        <td className="border p-2">{a.address}</td>
                        <td className="border p-2 whitespace-pre-wrap">{a.note}</td>
                        <td className="border p-2 whitespace-nowrap text-gray-600">{formatDate(a.createdAt)}</td>

                        {role === "admin" && (
                          <td className="border p-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleEditClick(a)}
                                className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                              >
                                Sửa
                              </button>
                              <button 
                                onClick={() => deleteAppointment(a._id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ MODAL SỬA LỊCH HẸN */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          {/* ✅ SỬA UI: Mobile 90%, PC 60% */}
          <div className="relative w-[90%] md:w-[60%] max-w-4xl rounded-2xl bg-white p-8 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setEditingAppointment(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose size={28} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-[#031432] text-center">Cập nhật thông tin</h3>
            
            {/* ✅ Render thông báo thành công hoặc form */}
            {updateStatus === "success" ? (
              <div className="text-center py-10 text-green-600 animate-fade-in-up">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold">Cập nhật thành công!</h4>
              </div>
            ) : (
              <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Tên khách hàng</label>
                    <input 
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1678F2] focus:ring-2 focus:ring-[#1678F2]/20 outline-none transition-all"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Số điện thoại</label>
                    <input 
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1678F2] focus:ring-2 focus:ring-[#1678F2]/20 outline-none transition-all"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Địa chỉ</label>
                  <input 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1678F2] focus:ring-2 focus:ring-[#1678F2]/20 outline-none transition-all"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Ghi chú</label>
                  <textarea 
                    rows="5"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#1678F2] focus:ring-2 focus:ring-[#1678F2]/20 outline-none transition-all resize-none"
                    value={editFormData.note}
                    onChange={(e) => setEditFormData({...editFormData, note: e.target.value})}
                  ></textarea>
                </div>
                
                {updateStatus === "error" && <p className="text-red-500 text-center">Lỗi khi cập nhật, vui lòng thử lại.</p>}

                <button 
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Lưu thay đổi
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;