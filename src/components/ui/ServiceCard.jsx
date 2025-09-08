import { Link } from "react-router-dom";
import Button from "./Button";
import { FaWhatsapp } from "react-icons/fa";

export default function ServiceCard({ title, description, cover, slug }) {
  return (
    <div className="flex h-full flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow transition hover:rotate-3 hover:scale-105">
      {/* Ảnh full width nhưng giữ chiều cao tối đa */}
      <img
        className="w-full max-h-[200px] object-contain mx-auto"
        src={cover}
        alt={title}
      />

      <div className="flex-1 w-full">
        <h4 className="font-poppins text-2xl font-medium text-black text-center">
          {title}
        </h4>
        {/* ✅ mô tả căn phải, giới hạn 2 dòng */}
        <p className="mt-3 text-sm text-para text-left line-clamp-2">
          {description}
        </p>
      </div>

      <Link to={`/services/${slug}`} className="w-full">
        <Button
          title="Tìm hiểu thêm"
          Icon={FaWhatsapp}
          className="w-full flex items-center justify-center gap-2 rounded-full 
                     bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 
                     font-medium text-white shadow hover:opacity-90 transition"
        />
      </Link>
    </div>
  );
}
