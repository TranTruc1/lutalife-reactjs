import { useState } from "react";
import { LuMessageCircle } from "react-icons/lu";

export default function Button({
  title = "Liên hệ thăm khám",
  Icon = LuMessageCircle,
  className = "",
}) {
  const [showForm, setShowForm] = useState(false); // Trạng thái mở form

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`bg-gradient-lr flex items-center gap-2 rounded-full px-7 py-4 text-lg font-semibold text-white transition hover:-rotate-3 ${className}`}
      >
        <Icon className="size-6" />
        {title}
      </button>
    </>
  );
}
