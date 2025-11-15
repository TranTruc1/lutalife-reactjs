import React from "react";
import { Button } from "./ui";
import { FaWhatsapp } from "react-icons/fa";

export default function Services() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col-reverse items-center justify-center gap-5 px-3 pb-28 pt-28 md:flex-row md:pb-[180px] lg:gap-6 lg:px-0 lg:pt-[140px]">
      <div className="flex flex-col items-start gap-4">
        <h5 className="font-poppins text-[22px] font-medium tracking-[0.44px] text-secondary">
          BLOOD PRESSURE SUPPORT
        </h5>
        <h1 className="max-w-[485px] font-poppins text-[32px] font-semibold leading-normal text-[#031432]">
          Giải pháp hỗ trợ huyết áp & tim mạch
        </h1>
        <p className="mb-4 max-w-[485px] text-para">
          Chiết xuất thiên nhiên từ Hawthorn, Garlic và Vitamin C giúp duy trì huyết áp ổn định, tăng cường sức khỏe tim mạch.
        </p>
        <Button title="Đặt lịch thăm khám miễn phí!" Icon={FaWhatsapp} />
      </div>

      <div className="max-h-[660px] max-w-[622px]">
        <img
          className="custom-animate size-[85%] object-contain md:size-full"
          src="/service.png"
          alt="About"
        />
      </div>
    </div>
  );
}
