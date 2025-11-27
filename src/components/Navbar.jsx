import { HiMiniBars3BottomRight } from "react-icons/hi2";
import Button from "./ui/ButtonForm";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"; 

export default function Navbar({ aboutRef, servicesRef, contactRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 
  const role = localStorage.getItem("role");   

  const managementLink = role === "admin" ? "/admin/users" : "/admin/appointments";

  const scrollToSection = (ref) => {
    if (ref?.current) {
      const y = ref.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-[#F2F7FF] bg-opacity-95 p-3 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <a href="/">
          <img
            className="h-[50px] w-[146px] object-contain"
            src="/logo.png"
            alt="Logo"
          />
        </a>

        {/* Menu Desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <button
              onClick={scrollToTop}
              className="text-primary-start hover:text-primary-start hover:opacity-100 font-medium transition-colors"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium transition-colors"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium transition-colors"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium transition-colors"
            >
              Contact
            </button>
          </li>

          {token && (
            <>
              <li>
                <Link 
                  to={managementLink} 
                  className="text-blue-600 font-bold hover:underline"
                >
                  Quản lý
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-bold border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
                >
                  Đăng xuất
                </button>
              </li>
            </>
          )}
        </ul>

        <Button className="hidden md:flex"/>

        {/* Menu Mobile */}
        <div className="relative md:hidden">
          {isOpen ? (
            <IoMdClose
              onClick={() => setIsOpen(false)}
              className="size-7 cursor-pointer text-primary-end relative z-50" // Icon luôn nổi lên trên backdrop
            />
          ) : (
            <HiMiniBars3BottomRight
              onClick={() => setIsOpen(true)}
              className="size-7 cursor-pointer text-primary-end"
            />
          )}

          {isOpen && (
            <>
              {/* ✅ BACKDROP: Lớp phủ full màn hình để bắt sự kiện click ra ngoài */}
              <div 
                className="fixed inset-0 z-40 bg-black/20 w-screen h-screen" 
                onClick={() => setIsOpen(false)}
              ></div>

              {/* ✅ MENU: Width 70% màn hình */}
              <div className="absolute right-0 top-10 w-[70vw] rounded-2xl border bg-white p-4 shadow-lg z-50 animate-fade-in-up">
                <ul className="mb-6 flex flex-col items-center gap-4">
                  <li>
                    <button
                      onClick={scrollToTop}
                      className="text-primary-start hover:text-primary-start hover:opacity-100 font-medium"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection(aboutRef)}
                      className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection(servicesRef)}
                      className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection(contactRef)}
                      className="text-para opacity-80 hover:text-primary-start hover:opacity-100 font-medium"
                    >
                      Contact
                    </button>
                  </li>

                  {token && (
                    <>
                      <li className="w-full border-t pt-2 mt-2">
                        <Link 
                          to={managementLink}
                          className="block text-center text-blue-600 font-bold"
                          onClick={() => setIsOpen(false)}
                        >
                          Vào trang Quản lý
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="text-red-500 font-bold w-full text-center"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </>
                  )}
                </ul>

                <Button className="w-full" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}