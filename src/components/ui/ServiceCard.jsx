import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function ServiceCard({ title, description, cover, slug }) {
  return (
    <div className="flex h-full flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow transition hover:rotate-3 hover:scale-105">
      <img
        className="mx-auto max-h-[200px] w-full object-contain"
        src={cover}
        alt={title}
        loading="lazy"
      />

      <div className="w-full flex-1">
        <h4 className="text-center font-poppins text-2xl font-medium text-black">{title}</h4>
        <p className="mt-3 line-clamp-2 text-left text-sm text-para">{description}</p>
      </div>

      <Link
        to={`/${slug}`}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-medium text-white shadow transition hover:opacity-90"
      >
        Tìm hiểu thêm <FaArrowRight className="size-4" />
      </Link>
    </div>
  );
}
