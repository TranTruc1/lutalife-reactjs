import { FaRegClock, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { IoPlayOutline } from "react-icons/io5";
import { PiPlusCircleBold } from "react-icons/pi";
import { MdEmail } from "react-icons/md";

export default function VideoSection() {
  return (
    <div className="mx-auto max-w-screen-xl p-3 pb-12 md:pb-16">
      <p className="mb-3 text-center font-poppins text-[22px] font-medium text-secondary">
        Why Dr. Matthew Anderson?
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
        A dedicated doctor with the core mission to help
      </h4>
      <p className="mx-auto max-w-[843px] text-center text-para leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam proin
        nibh cursus at sed sagittis amet, sed. Tristique id nibh lobortis nunc
        elementum. Tellus quam mauris aenean turpis vulputate sodales nullam
        lobortis. Vulputate tortor tincidun.
      </p>
    </div>

{/* Highlight items */}
<div className="mt-[60px] w-full px-4 md:px-8">
  <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
    <Item title="+15 years of experience" />
    <Item title="Urgent 24 hour service" Icon={FiCheckCircle} />
    <Item title="High quality care" Icon={PiPlusCircleBold} />
  </div>
</div>

      {/* ✅ Thông tin liên hệ + chứng nhận (có nền gradient) */}
      <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#E0F2FE] via-[#EDE9FE] to-[#FCE7F3] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <PhoneCard phone="+1 (234) 567-890" />
          <ContactCard Icon={MdEmail} title="Email" text="info@clinic.com" />
          <ContactCard
            Icon={FaMapMarkerAlt}
            title="Address"
            text="123 Main Street, New York, USA"
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
