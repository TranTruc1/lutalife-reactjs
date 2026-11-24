import { useEffect, useState } from "react";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonForm from "./ui/ButtonForm";
import { scrollToSection } from "./scroll";

const LINKS = [
  { id: "top", label: "Trang chủ" },
  { id: "san-pham", label: "Sản phẩm" },
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "dich-vu", label: "Dịch vụ" },
  { id: "lien-he", label: "Liên hệ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Đóng menu điện thoại bằng phím Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const goTo = (id) => {
    setIsOpen(false);
    if (pathname !== "/") {
      // Đang ở trang con: về trang chủ rồi cuộn tới mục cần xem
      navigate("/", { state: id === "top" ? null : { scrollTo: id } });
      if (id === "top") window.scrollTo(0, 0);
      return;
    }
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollToSection(id);
  };

  const linkCls = (i) =>
    `font-medium transition-colors hover:text-primary-start ${
      i === 0 ? "text-primary-start" : "text-para"
    }`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#F2F7FF]/95 p-3 shadow-sm backdrop-blur-md print:hidden">
      <nav
        className="mx-auto flex max-w-screen-xl items-center justify-between gap-4"
        aria-label="Điều hướng chính"
      >
        <Link to="/" onClick={() => goTo("top")} aria-label="LUTA LIFE - về trang chủ">
          <img
            className="h-[50px] w-[146px] object-contain"
            src="/logo.png"
            alt="LUTA LIFE"
          />
        </Link>

        {/* Menu máy tính */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l, i) => (
            <li key={l.id}>
              <button type="button" onClick={() => goTo(l.id)} className={linkCls(i)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <ButtonForm title="Đặt lịch tư vấn" className="hidden whitespace-nowrap lg:flex" />

        {/* Menu điện thoại / máy tính bảng */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="relative z-50 p-1 text-primary-end"
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <IoMdClose className="size-7" />
            ) : (
              <HiMiniBars3BottomRight className="size-7" />
            )}
          </button>

          {isOpen && (
            <>
              {/* Lớp phủ: bấm ra ngoài để đóng menu */}
              <div
                className="fixed inset-0 z-40 h-screen w-screen bg-black/20"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-[min(80vw,320px)] rounded-2xl border bg-white p-4 shadow-lg">
                <ul className="mb-5 flex flex-col items-center gap-4">
                  {LINKS.map((l, i) => (
                    <li key={l.id}>
                      <button type="button" onClick={() => goTo(l.id)} className={linkCls(i)}>
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <ButtonForm title="Đặt lịch tư vấn" className="w-full justify-center" />
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
