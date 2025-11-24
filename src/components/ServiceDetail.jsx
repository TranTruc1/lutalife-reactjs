import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import services from "../data/services.json";
import Navbar from "./Navbar";
import VideoSection from "./VideoSection"

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0); // nhảy thẳng lên đầu
  }, [slug]);

  if (!service) {
    return (
      <div className="max-w-screen-md mx-auto p-6">
        Không tìm thấy dịch vụ.
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-md mx-auto px-4 py-10">
        {/* Cover + Title */}
        <div className="mb-10 text-center">
          <img
            src={service.cover}
            alt={service.title}
            className="w-full h-64 object-cover rounded-2xl shadow"
          />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {service.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{service.excerpt}</p>
        </div>

        {/* Render blocks */}
        <div className="prose prose-lg max-w-none">
          {service.blocks.map((block, index) => {
            switch (block.type) {
              case "heading":
                if (block.level === 2) {
                  return (
                    <h2
                      key={index}
                      className="mt-10 mb-4 text-2xl font-semibold text-gray-800"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.level === 3) {
                  return (
                    <h3
                      key={index}
                      className="mt-8 mb-3 text-xl font-medium text-gray-700"
                    >
                      {block.text}
                    </h3>
                  );
                }
                return (
                  <h4 key={index} className="mt-6 mb-2 text-lg">
                    {block.text}
                  </h4>
                );

              case "paragraph":
                return (
                  <p
                    key={index}
                    className="mb-4 text-gray-700 leading-relaxed"
                  >
                    {block.text}
                  </p>
                );

              case "image":
                return (
                  <figure key={index} className="my-6">
                    <img
                      src={block.url}
                      alt={block.alt}
                      className="w-full rounded-xl shadow"
                    />
                    {block.caption && (
                      <figcaption className="mt-2 text-sm text-gray-500 text-center">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );

              case "list":
                return block.style === "unordered" ? (
                  <ul
                    key={index}
                    className="list-disc pl-6 space-y-1 text-gray-700"
                  >
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <ol
                    key={index}
                    className="list-decimal pl-6 space-y-1 text-gray-700"
                  >
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                );

              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6"
                  >
                    {block.text}
                    {block.by && (
                      <footer className="mt-1 text-sm text-gray-500">
                        — {block.by}
                      </footer>
                    )}
                  </blockquote>
                );

              case "gallery":
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8"
                  >
                    {block.images.map((img, i) => (
                      <figure key={i} className="flex flex-col items-center">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-40 object-cover rounded-xl shadow"
                        />
                        {img.caption && (
                          <figcaption className="mt-1 text-sm text-gray-500 text-center">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                );

              case "video": // ✅ thêm case video
                return (
                  <figure key={index} className="my-6">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow">
                      <iframe
                        src={block.url}
                        title={block.caption || "Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="mt-2 text-sm text-gray-500 text-center">
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
      <VideoSection />
    </div>
  );
}
