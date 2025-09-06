import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";

function AdminDashboard() {
  const [tab, setTab] = useState("appointments"); // mặc định cho editor
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ phone: "", password: "", role: "editor" });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 👈 lấy role từ login

  // Fetch users
  const fetchUsers = async () => {
    if (role !== "admin") return; // editor không gọi
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

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
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

  // Thêm user
  const addUser = async () => {
    try {
      const res = await fetch(API_BASE + "/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Thêm user thành công!");
        setNewUser({ phone: "", password: "", role: "editor" });
        fetchUsers();
      } else {
        alert(data.message || "❌ Lỗi thêm user!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa user
  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
      const res = await fetch(API_BASE + `/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("🗑️ Đã xóa user!");
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {role === "admin" && (
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Người dùng
          </button>
        )}
        <button
          onClick={() => setTab("appointments")}
          className={`px-4 py-2 rounded ${tab === "appointments" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Lịch hẹn
        </button>
      </div>

      {/* Tab người dùng (chỉ admin mới thấy) */}
      {role === "admin" && tab === "users" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
          {loading ? (
            <p>⏳ Đang tải...</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="border p-2">{u._id}</td>
                    <td className="border p-2">{u.phone}</td>
                    <td className="border p-2">{u.role}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Form thêm user */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">Thêm user mới</h3>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border p-2 mr-2"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 mr-2"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
            <button onClick={addUser} className="px-4 py-2 bg-green-500 text-white rounded">
              Thêm
            </button>
          </div>
        </>
      )}

      {/* Tab lịch hẹn (cả admin & editor) */}
      {tab === "appointments" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Danh sách lịch hẹn</h2>
          {loading ? (
            <p>⏳ Đang tải...</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Tên</th>
                  <th className="border p-2">Số điện thoại</th>
                  <th className="border p-2">Ngày</th>
                  <th className="border p-2">Dịch vụ</th>
                  <th className="border p-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td className="border p-2">{a.name}</td>
                    <td className="border p-2">{a.phone}</td>
                    <td className="border p-2">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="border p-2">{a.service}</td>
                    <td className="border p-2">{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
