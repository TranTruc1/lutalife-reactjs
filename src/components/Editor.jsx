import { useState, useRef, useEffect } from "react";

// ✅ Danh sách các file ảnh có trong thư mục public của bạn
// Bạn hãy bổ sung tên các file ảnh bạn đã copy vào folder public tại đây
const PUBLIC_IMAGES = [
  "/vien-uong-luta-life.jpg",
  "/vong-huyet-ap-toma-nhat-ban.jpg",
  "/logo.png",
  "/banner-trang-chu.jpg",
  "/khach-hang-1.jpg",
  "/khach-hang-2.jpg"
];

export default function Editor() {
  const [services, setServices] = useState([]);
  
  const [current, setCurrent] = useState({
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    cover: "",
    coverAlt: "", 
    blocks: [],
  });

  const [editingBlockIndex, setEditingBlockIndex] = useState(null);
  const [block, setBlock] = useState({ type: "paragraph", text: "" });
  const [jsonInput, setJsonInput] = useState("");

  // drag state
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const previewRefs = useRef([]);

  // --------- helpers ----------
  const firstWords = (str = "", n = 8) =>
    String(str).trim().split(/\s+/).slice(0, n).join(" ");

  const labelOfBlock = (b) => {
    switch (b.type) {
      case "heading":
        return b.text ? b.text : "Heading";
      case "paragraph":
        return firstWords(b.text || "Paragraph", 8);
      case "image": {
        const hint = b.caption || b.alt || b.url || "";
        return `[image] - ${firstWords(hint, 8)}`;
      }
      case "video": {
        const hint = b.caption || b.url || "";
        return `[video] - ${firstWords(hint, 8)}`;
      }
      case "list": {
        const items = b.items || [];
        if (items.length === 0) return "[list] - 0 item";
        return `[list] - ${items.length} items`;
      }
      case "quote":
        return `❝ ${firstWords(b.text || "", 8)}`;
      case "gallery":
        return `[gallery] - ${(b.images || []).length} ảnh`;
      default:
        return b.type;
    }
  };

  // --------- CRUD block ----------
  const saveBlock = () => {
    if (editingBlockIndex !== null) {
      const updated = [...current.blocks];
      updated[editingBlockIndex] = block;
      setCurrent({ ...current, blocks: updated });
      setEditingBlockIndex(null);
    } else {
      setCurrent({ ...current, blocks: [...current.blocks, block] });
    }
    setBlock({ type: "paragraph", text: "" });
  };

  const editBlock = (i) => {
    setBlock(current.blocks[i]);
    setEditingBlockIndex(i);
  };

  useEffect(() => {
    if (editingBlockIndex !== null && previewRefs.current[editingBlockIndex]) {
      previewRefs.current[editingBlockIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [editingBlockIndex]);

  const deleteBlock = (i) => {
    const updated = current.blocks.filter((_, idx) => idx !== i);
    setCurrent({ ...current, blocks: updated });
    setEditingBlockIndex(null);
  };

  // --------- Reorder ----------
  const handleDrop = (from, to) => {
    setDragOverIndex(null);
    if (from === to) return;
    const updated = [...current.blocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setCurrent({ ...current, blocks: updated });
    if (editingBlockIndex === from) {
      setEditingBlockIndex(to);
      setBlock(updated[to]);
    }
  };

  // --------- JSON & service list ----------
  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(services, null, 2));
    alert("✅ Đã copy JSON vào clipboard!");
  };

  const saveService = () => {
    const exists = services.find((s) => s.id === current.id);
    const updated = exists
      ? services.map((s) => (s.id === current.id ? current : s))
      : [...services, current];
    setServices(updated);
    alert("💾 Đã lưu dịch vụ!");
  };

  const loadJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        setServices(parsed);
        alert("✅ Đã load danh sách dịch vụ!");
      } else {
        alert("❌ JSON phải là một mảng!");
      }
    } catch {
      alert("❌ JSON không hợp lệ!");
    }
  };

  const selectService = (s) => {
    setCurrent({ ...s, coverAlt: s.coverAlt || "" });
    setEditingBlockIndex(null);
    setBlock({ type: "paragraph", text: "" });
    setDragOverIndex(null);
  };

  // Helper render thư viện ảnh
  const renderImagePicker = (onSelect, currentUrl) => (
    <div className="mt-2 p-2 border rounded bg-white">
      <p className="text-xs font-bold text-gray-500 mb-2">📸 Chọn từ thư mục Public:</p>
      <div className="grid grid-cols-4 gap-2">
        {PUBLIC_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => onSelect(img)}
            className={`cursor-pointer border-2 rounded overflow-hidden relative group h-16 ${currentUrl === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'}`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold">
              Chọn
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-1 italic">*Copy ảnh vào thư mục public và thêm tên vào code để hiện ở đây</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* --- Left: Editor form --- */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Editor Nội Dung & SEO</h1>

        {/* Nhập JSON */}
        <textarea
          placeholder="Dán JSON vào đây"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full border p-2 mb-2 rounded h-32 text-xs font-mono"
        />
        <button
          onClick={loadJson}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-6 hover:bg-purple-700 transition"
        >
          Load JSON
        </button>

        {/* Danh sách service */}
        {services.length > 0 && (
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Danh sách đã load:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {services.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => selectService(s)}
                    className="text-blue-600 hover:underline text-left"
                  >
                    {s.title || s.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service fields */}
        <div className="space-y-3 mb-6 border-b pb-6">
          <h3 className="font-bold text-gray-700">Thông tin chung</h3>
          <input
            placeholder="ID (ví dụ: prod-01)"
            value={current.id}
            onChange={(e) => setCurrent({ ...current, id: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Slug (URL thân thiện)"
            value={current.slug}
            onChange={(e) => setCurrent({ ...current, slug: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Tiêu đề sản phẩm"
            value={current.title}
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Mô tả ngắn (Excerpt)"
            value={current.excerpt}
            onChange={(e) => setCurrent({ ...current, excerpt: e.target.value })}
            className="w-full border p-2 rounded h-20"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Ảnh bìa (Cover)</label>
              <input
                placeholder="Dán link hoặc chọn bên dưới"
                value={current.cover}
                onChange={(e) => setCurrent({ ...current, cover: e.target.value })}
                className="w-full border p-2 rounded mb-1"
              />
              {/* Picker cho Cover */}
              {renderImagePicker((url) => setCurrent({...current, cover: url}), current.cover)}
            </div>

            <div>
               <label className="text-xs font-bold text-gray-600 mb-1 block">SEO Cover Alt</label>
               <input
                placeholder="Mô tả ảnh cover (Alt SEO)"
                value={current.coverAlt}
                onChange={(e) => setCurrent({ ...current, coverAlt: e.target.value })}
                className="w-full border p-2 rounded border-blue-300 bg-blue-50"
                title="Quan trọng cho SEO: Mô tả nội dung ảnh bìa"
              />
            </div>
          </div>
        </div>

        {/* Block form */}
        <div className="bg-gray-50 p-4 rounded border mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            {editingBlockIndex !== null ? "✏️ Sửa Block" : "➕ Thêm Block Mới"}
          </h2>

          <select
            value={block.type}
            onChange={(e) => setBlock({ type: e.target.value })}
            className="w-full border p-2 mb-3 rounded font-medium"
          >
            <option value="paragraph">Paragraph (Đoạn văn)</option>
            <option value="heading">Heading (Tiêu đề)</option>
            <option value="image">Image (Hình ảnh)</option>
            <option value="list">List (Danh sách)</option>
            <option value="quote">Quote (Trích dẫn)</option>
            <option value="gallery">Gallery (Bộ sưu tập)</option>
            <option value="video">Video</option>
          </select>

          {/* Render inputs based on block type */}
          <div className="space-y-2">
            {block.type === "heading" && (
              <>
                <input
                  placeholder="Cấp độ (2,3,4)"
                  type="number"
                  min="1" max="6"
                  value={block.level || 2}
                  onChange={(e) =>
                    setBlock({ ...block, level: parseInt(e.target.value) })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Nội dung tiêu đề"
                  value={block.text || ""}
                  onChange={(e) => setBlock({ ...block, text: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            {block.type === "paragraph" && (
              <textarea
                placeholder="Nội dung đoạn văn..."
                value={block.text || ""}
                onChange={(e) => setBlock({ ...block, text: e.target.value })}
                className="w-full border p-2 rounded h-24"
              />
            )}

            {block.type === "image" && (
              <div className="space-y-3">
                <div>
                   <label className="text-xs font-bold text-gray-600 mb-1 block">Đường dẫn ảnh</label>
                   <input
                    placeholder="URL hình ảnh"
                    value={block.url || ""}
                    onChange={(e) => setBlock({ ...block, url: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                  {/* Picker cho Block Image */}
                  {renderImagePicker((url) => setBlock({...block, url: url}), block.url)}
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">SEO & Caption</label>
                  <input
                    placeholder="Thẻ Alt (Mô tả ảnh cho SEO)"
                    value={block.alt || ""}
                    onChange={(e) => setBlock({ ...block, alt: e.target.value })}
                    className="w-full border p-2 rounded border-blue-300 bg-blue-50 mb-2"
                  />
                  <input
                    placeholder="Chú thích ảnh (Caption - hiển thị dưới ảnh)"
                    value={block.caption || ""}
                    onChange={(e) => setBlock({ ...block, caption: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            )}

            {block.type === "list" && (
              <>
                <select
                  value={block.style || "unordered"}
                  onChange={(e) => setBlock({ ...block, style: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="unordered">Dấu chấm tròn (Unordered)</option>
                  <option value="ordered">Số thứ tự (Ordered)</option>
                </select>
                <textarea
                  placeholder="Nhập các mục, mỗi mục 1 dòng..."
                  value={block.items ? block.items.join("\n") : ""}
                  onChange={(e) =>
                    setBlock({ ...block, items: e.target.value.split("\n") })
                  }
                  className="w-full border p-2 rounded h-32"
                />
              </>
            )}

            {block.type === "quote" && (
              <>
                <textarea
                  placeholder="Nội dung trích dẫn"
                  value={block.text || ""}
                  onChange={(e) => setBlock({ ...block, text: e.target.value })}
                  className="w-full border p-2 rounded h-20"
                />
                <input
                  placeholder="Tác giả / Nguồn"
                  value={block.by || ""}
                  onChange={(e) => setBlock({ ...block, by: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            {block.type === "gallery" && (
              <textarea
                placeholder="Nhập URL ảnh, mỗi dòng 1 link"
                value={block.images ? block.images.map((i) => i.url).join("\n") : ""}
                onChange={(e) =>
                  setBlock({
                    ...block,
                    images: e.target.value
                      .split("\n")
                      .map((url) => ({ url: url.trim(), alt: "" })),
                  })
                }
                className="w-full border p-2 rounded h-32"
              />
            )}

            {block.type === "video" && (
              <>
                <input
                  placeholder="Video Embed URL (Youtube/Vimeo)"
                  value={block.url || ""}
                  onChange={(e) => setBlock({ ...block, url: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Caption cho video"
                  value={block.caption || ""}
                  onChange={(e) => setBlock({ ...block, caption: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={saveBlock}
              className={`flex-1 px-4 py-2 rounded text-white font-bold transition ${
                editingBlockIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingBlockIndex !== null ? "Lưu thay đổi" : "Thêm Block"}
            </button>
            {editingBlockIndex !== null && (
               <button
               onClick={() => {
                 setEditingBlockIndex(null);
                 setBlock({ type: "paragraph", text: "" });
               }}
               className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
             >
               Hủy
             </button>
            )}
          </div>
        </div>

        {/* Danh sách block */}
        <h3 className="mt-6 font-bold text-gray-700">Các Block đã tạo:</h3>
        <ul className="list-none pl-0 border rounded divide-y divide-gray-200 mt-2">
          {current.blocks.map((b, i) => (
            <li
              key={i}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("blockIndex", i)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(i);
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => {
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData("blockIndex"));
                handleDrop(from, i);
              }}
              className={`flex justify-between items-center px-4 py-3 ${
                i === editingBlockIndex ? "bg-yellow-50" : "bg-white hover:bg-gray-50"
              }`}
              style={{
                borderTop:
                  dragOverIndex === i ? "3px solid #3b82f6" : "1px solid transparent",
                paddingTop: dragOverIndex === i ? 14 : 12,
                transition: "padding 100ms ease",
                cursor: "grab",
              }}
            >
              <button
                className="text-left flex-1 truncate font-medium text-gray-700"
                title={labelOfBlock(b)}
                onClick={() => editBlock(i)}
              >
                <span className="text-gray-400 mr-2">#{i + 1}</span>
                {labelOfBlock(b)}
              </button>

              <div className="flex items-center gap-2 pl-3 shrink-0">
                <button
                  onClick={() => i > 0 && handleDrop(i, i - 1)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Lên"
                >
                  ↑
                </button>
                <button
                  onClick={() =>
                    i < current.blocks.length - 1 && handleDrop(i, i + 1)
                  }
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Xuống"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteBlock(i)}
                  className="ml-2 text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 flex gap-4 sticky bottom-4 bg-white p-4 border rounded shadow-lg z-10">
          <button
            onClick={saveService}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition"
          >
            💾 Lưu Sản Phẩm
          </button>
          <button
            onClick={copyJson}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-gray-900 transition"
          >
            Copy JSON
          </button>
        </div>
      </div>

      {/* --- Right: Preview --- */}
      <div className="border-l pl-6 overflow-y-auto max-h-screen bg-gray-50/50 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Xem Trước (Preview)</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[500px]">
          <Preview
            service={current}
            previewRefs={previewRefs}
            onClickBlock={(i) => editBlock(i)}
            editingBlockIndex={editingBlockIndex}
          />
        </div>
      </div>
    </div>
  );
}

// Preview Component
function Preview({ service, previewRefs, onClickBlock, editingBlockIndex }) {
  if (!service) return null;

  return (
    <div className="max-w-full">
      {service.cover && (
        <div className="relative group">
            <img
            src={service.cover}
            alt={service.coverAlt || service.title} // ✅ Hiển thị Alt Cover
            className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
            />
            {/* Hint for SEO checking */}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Alt: {service.coverAlt || "Chưa có"}
            </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title || "Tiêu đề sản phẩm"}</h1>
      <p className="text-lg text-gray-600 mb-8 italic">{service.excerpt || "Mô tả ngắn..."}</p>

      {service.blocks?.map((block, i) => {
        const baseProps = {
          key: i,
          ref: (el) => (previewRefs.current[i] = el),
          onClick: () => onClickBlock(i),
          className:
            (i === editingBlockIndex ? "ring-2 ring-yellow-400 bg-yellow-50 " : "hover:bg-gray-50 ") + 
            "cursor-pointer rounded-lg p-1 transition-all",
        };

        switch (block.type) {
          case "heading": {
            const HeadingTag = `h${block.level || 2}`;
            const sizeClass = block.level === 3 ? "text-xl" : "text-2xl";
            return (
              <HeadingTag
                {...baseProps}
                className={`${baseProps.className} ${sizeClass} font-bold text-gray-800 mt-6 mb-3`}
              >
                {block.text}
              </HeadingTag>
            );
          }
          case "paragraph":
            return (
              <p {...baseProps} className={baseProps.className + " mb-4 text-gray-700 leading-relaxed"}>
                {block.text}
              </p>
            );
          case "image":
            return (
              <figure {...baseProps} className={baseProps.className + " my-6"}>
                <div className="relative group/img">
                    <img 
                        src={block.url} 
                        alt={block.alt} // ✅ Hiển thị Alt Block Image
                        className="w-full rounded-xl shadow-sm" 
                    />
                    {/* Tooltip hiển thị Alt để kiểm tra */}
                     <div className="absolute top-2 left-2 bg-blue-600/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/img:opacity-100 pointer-events-none">
                        Alt: {block.alt || "Trống"}
                    </div>
                </div>
                {block.caption && (
                  <figcaption className="text-sm text-gray-500 text-center mt-2 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "list":
            return block.style === "unordered" ? (
              <ul
                {...baseProps}
                className={baseProps.className + " list-disc pl-6 mb-4 space-y-2 text-gray-700"}
              >
                {block.items?.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            ) : (
              <ol
                {...baseProps}
                className={baseProps.className + " list-decimal pl-6 mb-4 space-y-2 text-gray-700"}
              >
                {block.items?.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                {...baseProps}
                className={baseProps.className + " border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg italic my-6 text-gray-700"}
              >
                &ldquo;{block.text}&rdquo;
                {block.by && <footer className="text-sm font-semibold not-italic mt-2 text-right">— {block.by}</footer>}
              </blockquote>
            );
          case "gallery":
            return (
              <div
                {...baseProps}
                className={baseProps.className + " grid grid-cols-2 gap-4 my-6"}
              >
                {block.images?.map((img, j) => (
                  <img
                    key={j}
                    src={img.url}
                    alt={img.alt || `Gallery ${j}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            );
          case "video":
            return (
              <div {...baseProps} className={baseProps.className + " my-6"}>
                <div className="relative pb-[56.25%] h-0 bg-gray-100 rounded-xl overflow-hidden">
                    <iframe
                    src={block.url}
                    title={`video-${i}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    />
                </div>
                {block.caption && (
                  <p className="text-sm text-gray-500 text-center mt-2 italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}