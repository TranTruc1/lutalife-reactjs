import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { PiPlusCircleBold } from "react-icons/pi";

export default function ListItems() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-4 px-3 md:gap-7">
      <Item 
        title="Hỗ trợ 24/7" 
        description="Luôn sẵn sàng tư vấn và giải đáp thắc mắc."
      />
      <Item 
        title="15 năm kinh nghiệm" 
        Icon={FiCheckCircle} 
        description="Uy tín lâu năm trong lĩnh vực tim mạch."
      />
      <Item 
        title="Chất lượng chuẩn Mỹ" 
        Icon={PiPlusCircleBold} 
        description="Sản phẩm đạt chuẩn FDA, an toàn tuyệt đối."
      />
    </div>
  );
}

function Item({
  Icon = FaRegClock,
  title = "",
  description = "",
}) {
  return (
    <div
      className="
        flex
        w-[90%]       /* Chiếm 90% chiều ngang màn hình mobile */
        md:w-max     /* Desktop giữ nguyên dạng width auto */
        translate-y-[50%]
        items-center
        gap-3
        rounded-[12px]
        bg-gradient-to-t
        from-[#65A8FB]
        to-[#1678F2]
        px-[18px]
        py-2
        text-white
        md:max-w-[295px]
      "
    >
      <div>
        <Icon className="size-[38px]" />
      </div>
      <div>
        <h3 className="font-poppins text-lg font-medium">{title}</h3>
        <p className="font-sora text-xs opacity-90">{description}</p>
      </div>
    </div>
  );
}
