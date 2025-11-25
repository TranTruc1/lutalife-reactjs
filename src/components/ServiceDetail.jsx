import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// Giả sử file json nằm ở ../data/services.json, hãy điều chỉnh nếu khác
import services from "../data/services.json"; 
import Navbar from "./Navbar";
import VideoSection from "./VideoSection";

export default function ServiceDetail() {
  const { slug } = useParams();
  // Tìm bài viết dựa trên slug
  const service = services.find((s) => s.slug === slug);

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi slug thay đổi (chuyển bài viết)
    window.scrollTo(0, 0); 
  }, [slug]);

  if (!service) {
    return (
      <div className="max-w-screen-md mx-auto p-6 text-center text-gray-500">
        Không tìm thấy bài viết. Vui lòng kiểm tra lại đường dẫn.
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-md mx-auto px-4 py-10">
        {/* === COVER IMAGE & TITLE === */}
        <div className="mb-10 text-center">
          <img
            src={service.cover}
            // Ưu tiên dùng coverAlt (nếu có trong JSON), nếu không thì dùng Title
            alt={service.coverAlt || service.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-md"
          />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 italic">{service.excerpt}</p>
        </div>

        {/* === RENDER BLOCKS === */}
        <div className="prose prose-lg prose-blue max-w-none">
          {service.blocks.map((block, index) => {
            switch (block.type) {
              case "heading":
                if (block.level === 2) {
                  return (
                    <h2
                      key={index}
                      className="mt-12 mb-6 text-2xl md:text-3xl font-bold text-gray-800 border-b pb-2"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.level === 3) {
                  return (
                    <h3
                      key={index}
                      className="mt-8 mb-4 text-xl md:text-2xl font-semibold text-gray-700"
                    >
                      {block.text}
                    </h3>
                  );
                }
                return (
                  <h4 key={index} className="mt-6 mb-2 text-lg font-medium text-gray-700">
                    {block.text}
                  </h4>
                );

              case "paragraph":
                return (
                  <div key={index} className="mb-6 text-gray-700 leading-relaxed text-justify">
                    {/* Xử lý xuống dòng (\n) nếu có trong text */}
                    {block.text.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                );

              case "image":
                return (
                  <figure key={index} className="my-8">
                    <img
                      src={block.url}
                      alt={block.alt || "Luta Life Image"} // Fallback nếu thiếu alt
                      className="w-full h-auto rounded-xl shadow-lg"
                      loading="lazy" // Tối ưu tải trang
                    />
                    {block.caption && (
                      <figcaption className="mt-3 text-sm text-gray-500 text-center italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );

              case "list":
                const ListTag = block.style === "unordered" ? "ul" : "ol";
                const listClass = block.style === "unordered" ? "list-disc" : "list-decimal";
                return (
                  <ListTag
                    key={index}
                    className={`${listClass} pl-6 mb-6 space-y-2 text-gray-700`}
                  >
                    {block.items.map((item, i) => (
                      <li key={i}>
                        {/* Hỗ trợ in đậm bằng cú pháp **text** đơn giản */}
                        {item.split("**").map((part, idx) =>
                          idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                        )}
                      </li>
                    ))}
                  </ListTag>
                );

              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-blue-600 bg-blue-50 pl-4 py-4 pr-4 italic text-gray-800 my-8 rounded-r-lg"
                  >
                    <p className="mb-2">"{block.text}"</p>
                    {block.by && (
                      <footer className="text-sm text-gray-600 font-semibold not-italic text-right">
                        — {block.by}
                      </footer>
                    )}
                  </blockquote>
                );

              case "gallery":
                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10"
                  >
                    {block.images.map((img, i) => (
                      <figure key={i} className="flex flex-col">
                        <img
                          src={img.url}
                          // SEO: Lấy alt từ json, fallback dùng caption, cuối cùng dùng index
                          alt={img.alt || img.caption || `Hình ảnh minh họa ${i}`}
                          className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                          loading="lazy"
                        />
                        {img.caption && (
                          <figcaption className="mt-2 text-sm text-gray-500 text-center">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                );

              case "video":
                return (
                  <figure key={index} className="my-8">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
                      <iframe
                        src={block.url}
                        title={block.caption || "Video minh họa"}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="mt-3 text-sm text-gray-500 text-center italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
      
      {/* Footer Section or Video Section */}
      <VideoSection />
    </div>
  );
}