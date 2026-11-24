import { useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import BookAnAppointment from "../BookAnAppointment";

// Nút mở form đặt lịch (form gửi thẳng vào Google Sheet)
export default function ButtonForm({
  title = "Đặt lịch tư vấn",
  Icon = LuMessageCircle,
  className = "",
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className={`bg-gradient-lr flex items-center gap-2 rounded-full px-7 py-4 text-lg font-semibold text-white transition hover:-rotate-3 ${className}`}
      >
        <Icon className="size-6 shrink-0" />
        {title}
      </button>

      {showForm && <BookAnAppointment onClose={() => setShowForm(false)} />}
    </>
  );
}
