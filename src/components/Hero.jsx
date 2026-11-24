import { ButtonForm } from "./ui";

export default function Hero() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col-reverse items-center justify-between gap-4 px-3 pb-10 pt-[80px] md:flex-row md:pb-[90px] lg:gap-[72px] lg:px-0 lg:pt-[108px]">
      <div className="mt-10 flex flex-col items-start gap-6 md:mt-0">
        <h5 className="font-poppins text-[22px] font-medium tracking-[0.44px] text-secondary">
          LUTA LIFE
        </h5>
        <h1 className="font-poppins text-4xl font-bold text-[#031432] md:text-5xl md:leading-[120%]">
          Giải pháp đến từ chuyên gia Hoa Kỳ
        </h1>
        <p className="max-w-[452px] text-para">
          Sản phẩm được nghiên cứu & phát triển bởi đội ngũ bác sĩ tại Mỹ, giúp ổn định huyết áp và bảo vệ tim mạch tự nhiên.
        </p>
        <ButtonForm title="Đặt lịch tư vấn" />
      </div>

      <div className="max-h-[506px] max-w-[678px]">
        <img
          className="custom-animate size-full object-contain"
          src="https://res.cloudinary.com/dgxtwb88k/image/upload/v1764035428/g446_xcpr91.png"
          alt="Đội ngũ nghiên cứu LUTA LIFE trong phòng thí nghiệm"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
