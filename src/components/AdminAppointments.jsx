// import React, { useEffect, useState } from "react";
// import {API_BASE} from "./api/"
// export default function Appointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [role, setRole] = useState(null);

//   // Lấy role từ token hoặc localStorage
//   useEffect(() => {
//     const savedRole = localStorage.getItem("role"); 
//     // 👆 Ví dụ: khi login backend trả về { token, role: "admin" }
//     if (savedRole) setRole(savedRole);
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(API_BASE + "/api/appointments", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setAppointments(data);
//     } catch (err) {
//       console.error("❌ Lỗi load appointments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">
//         {role === "admin" ? "Quản lý lịch hẹn (Admin)" : "Danh sách lịch hẹn (Editor)"}
//       </h2>

//       <table className="w-full border">
//         <thead>

//         </thead>
//         <tbody>
//           {appointments.map((a) => (
//             <tr key={a._id}>
//               <td className="border px-2 py-1">{a.name}</td>
//               <td className="border px-2 py-1">{a.phone}</td>
//               <td className="border px-2 py-1">{a.date}</td>
//               <td className="border px-2 py-1">{a.service}</td>
//               <td className="border px-2 py-1">{a.note}</td>
//               {role === "admin" && (
//                 <td className="border px-2 py-1 text-center">
//                   <button className="px-2 py-1 bg-red-500 text-white rounded mr-2">
//                     Xóa
//                   </button>
//                   <button className="px-2 py-1 bg-yellow-500 text-white rounded">
//                     Sửa
//                   </button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
