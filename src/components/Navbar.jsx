import { HiMiniBars3BottomRight } from "react-icons/hi2";
import Button from "./ui/Button";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

export default function Navbar({ aboutRef, servicesRef, contactRef }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // đóng menu mobile
    }
  };
  const [user, setUser] = useState(null);

  // ✅ Wake up backend khi FE load
  useEffect(() => {
    axios
      .get(API_BASE +"/api/ping")
      .then(() => console.log("✅ Backend woke up."))
      .catch(() => console.warn("⚠️ Backend not responding yet"));
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-[#F2F7FF] bg-opacity-80 p-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <a href="/">
          <img
            className="h-[50px] w-[146px] object-contain"
            src="/logo.svg"
            alt="Logo"
          />
        </a>

        {/* Menu Desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <button
              onClick={scrollToTop}
              className="text-primary-start hover:text-primary-start hover:opacity-100"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
            >
              Contact
            </button>
          </li>
        </ul>

        <Button className="hidden md:flex" />

        {/* Menu Mobile */}
        <div className="relative md:hidden">
          {isOpen ? (
            <IoMdClose
              onClick={() => setIsOpen(false)}
              className="size-7 cursor-pointer text-primary-end"
            />
          ) : (
            <HiMiniBars3BottomRight
              onClick={() => setIsOpen(true)}
              className="size-7 cursor-pointer text-primary-end"
            />
          )}

          {isOpen && (
            <div className="absolute right-2 top-8 min-w-[220px] rounded-2xl border bg-white p-4 shadow-lg">
              <ul className="mb-8 flex flex-col items-center gap-6">
                <li>
                  <button
                    onClick={scrollToTop}
                    className="text-primary-start hover:text-primary-start hover:opacity-100"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(servicesRef)}
                    className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-para opacity-80 hover:text-primary-start hover:opacity-100"
                  >
                    Contact
                  </button>
                </li>
              </ul>

              <Button className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
