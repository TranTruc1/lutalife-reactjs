import { FaRegClock, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { IoPlayOutline } from "react-icons/io5";
import { PiPlusCircleBold } from "react-icons/pi";
import { MdEmail } from "react-icons/md";

export default function VideoSection() {
  return (
    <div className="mx-auto max-w-screen-xl p-3 pb-12 md:pb-16">
      <p className="mb-3 text-center font-poppins text-[22px] font-medium text-secondary">
        Tại sao chọn Dr. Matthew Anderson?
      </p>

      {/* Video Section */}
      <div className="relative mt-4 flex w-full items-center justify-center">
        <img className="w-full" src="/video-bg.png" alt="Video" />
        <button className="absolute flex size-[60px] items-center justify-center rounded-full bg-primary-start md:size-[100px]">
          <IoPlayOutline className="ml-2 size-10 text-white md:size-16" />
        </button>
      </div>

      {/* Title & description */}
      <div className="px-4 md:px-8">
        <h4 className="mb-3 mt-4 text-center font-poppins text-[32px] font-semibold text-[#031432]">
          Đội ngũ chuyên gia y tế hàng đầu Hoa Kỳ
        </h4>
        <p className="mx-auto max-w-[843px] text-center text-para leading-relaxed">
          Được dẫn dắt bởi Dr. Matthew Anderson, đội ngũ của chúng tôi quy tụ những bác sĩ và nhà nghiên cứu giàu kinh nghiệm nhất. Chúng tôi cam kết mang đến các giải pháp hỗ trợ sức khỏe tim mạch dựa trên nền tảng khoa học tiên tiến, quy trình kiểm định nghiêm ngặt và sự tận tâm tuyệt đối với sức khỏe cộng đồng.
        </p>
      </div>

      {/* Highlight items */}
      <div className="mt-[60px] w-full px-4 md:px-8">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <Item title="Hơn 15 năm kinh nghiệm" />
          <Item title="Hỗ trợ chuyên môn 24/7" Icon={FiCheckCircle} />
          <Item title="Chất lượng chuẩn Quốc tế" Icon={PiPlusCircleBold} />
        </div>
      </div>

      {/* ✅ Thông tin liên hệ + chứng nhận (có nền gradient) */}
      <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#E0F2FE] via-[#EDE9FE] to-[#FCE7F3] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <PhoneCard phone="+1 832-650-2216" />
          <ContactCard Icon={MdEmail} title="Email" text="Lutalifeusa@gmail.com" />
          <ContactCard
            Icon={FaMapMarkerAlt}
            title="Address"
            text="11462 Pagemill Rd, Dallas, TX 75243"
          />
          <CertificationCard
            title="Certification"
            image="/kiemdinh.png"
          />
        </div>
      </div>
    </div>
  );
}

function Item({ Icon = FaRegClock, title = "" }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[12px] bg-gradient-to-t from-[#65A8FB] to-[#1678F2] px-7 py-5 text-white transition hover:-rotate-3 md:max-w-[320px]">
      <Icon className="size-[40px]" />
      <h3 className="font-poppins text-lg font-medium">{title}</h3>
    </div>
  );
}

function ContactCard({ Icon, title, text }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow hover:shadow-lg transition">
      <Icon className="mb-4 size-8 text-primary-start" />
      <h4 className="font-semibold text-lg leading-snug">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function PhoneCard({ phone }) {
  return (
    <a
      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
      className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow hover:shadow-lg transition"
    >
      <FaPhoneAlt className="mb-4 size-8 text-primary-start" />
      <h4 className="font-semibold text-lg leading-snug">Phone</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{phone}</p>
    </a>
  );
}

function CertificationCard({ title, image }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-5 text-center shadow hover:shadow-lg transition">
      <h4 className="mb-3 font-semibold text-lg leading-snug">{title}</h4>
      <img src={image} alt="certification" className="h-24 object-contain" />
    </div>
  );
}