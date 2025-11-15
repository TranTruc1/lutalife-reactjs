import React from "react";
import { ButtonForm } from "./ui";
import { FaWhatsapp } from "react-icons/fa";

export default function About() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-5 px-3 pt-28 md:flex-row md:pb-[145px] lg:gap-20 lg:px-0 lg:pt-[220px]">
      <div className="max-h-[495px] max-w-[586px]">
        <img
          className="custom-animate size-[85%] object-contain md:size-full"
          src="/about.png"
          alt="About"
        />
      </div>

      <div className="flex flex-col items-start gap-4">
        <h5 className="font-poppins text-[22px] font-medium tracking-[0.44px] text-secondary">
          Dr. Matthew Anderson
        </h5>
        <h1 className="max-w-[485px] font-poppins text-[32px] font-semibold leading-normal text-[#031432]">
          Chuyên gia sức khỏe Hoa Kỳ
        </h1>
        <p className="mb-4 max-w-[485px] text-para">
          Người đứng đầu nhóm nghiên cứu Luta Life – với sứ mệnh hỗ trợ hàng triệu người kiểm soát huyết áp tự nhiên.
        </p>
        <ButtonForm title="Đặt lịch khám miễn phí!" Icon={FaWhatsapp} />
      </div>
    </div>
  );
}
