import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";
import Navbar from "./Navbar";

function AppointmentsPage() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/appointments`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(setApps)
      .catch(console.error);
  }, []);

  return (
    <div className="p-36">
    <Navbar />
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách lịch hẹn</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2">Tên</th>
            <th className="border px-2">SĐT</th>
            <th className="border px-2">Ngày</th>
            <th className="border px-2">Dịch vụ</th>
            <th className="border px-2">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a._id}>
              <td className="border px-2">{a.name}</td>
              <td className="border px-2">{a.phone}</td>
              <td className="border px-2">{new Date(a.date).toLocaleDateString()}</td>
              <td className="border px-2">{a.service}</td>
              <td className="border px-2">{a.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default AppointmentsPage;
