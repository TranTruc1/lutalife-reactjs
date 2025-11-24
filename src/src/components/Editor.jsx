import React, { useState, useRef, useEffect } from "react";

export default function Editor() {
  const [services, setServices] = useState([]);
  const [current, setCurrent] = useState({
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    cover: "",
    blocks: [],
  });

  const [editingBlockIndex, setEditingBlockIndex] = useState(null);
  const [block, setBlock] = useState({ type: "paragraph", text: "" });
  const [jsonInput, setJsonInput] = useState("");

  // drag state để tạo khoảng "đẩy" khi kéo
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const previewRefs = useRef([]);

  // --------- helpers ----------
  const firstWords = (str = "", n = 8) =>
    String(str)
      .trim()
      .split(/\s+/)
      .slice(0, n)
      .join(" ");

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
        if (items.length === 1) return `[list] - ${firstWords(items[0], 8)}`;
        return `[list] - ${firstWords(items[0], 4)} · ${firstWords(
          items[1],
          4
        )}${items.length > 2 ? " +" + (items.length - 2) : ""}`;
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
    // nếu đang sửa cái vừa move, cập nhật index cho đúng
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
    setCurrent(s);
    setEditingBlockIndex(null);
    setBlock({ type: "paragraph", text: "" });
    setDragOverIndex(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* --- Left: Editor form --- */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Editor</h1>

        {/* Nhập JSON */}
        <textarea
          placeholder="Dán JSON vào đây"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full border p-2 mb-2 rounded h-32"
        />
        <button
          onClick={loadJson}
          className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
        >
          Load JSON
        </button>

        {/* Danh sách service */}
        {services.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Danh sách dịch vụ:</h2>
            <ul className="list-disc pl-6">
              {services.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => selectService(s)}
                    className="text-blue-600 underline"
                  >
                    {s.title || s.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service fields */}
        <input
          placeholder="ID"
          value={current.id}
          onChange={(e) => setCurrent({ ...current, id: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          placeholder="Slug"
          value={current.slug}
          onChange={(e) => setCurrent({ ...current, slug: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          placeholder="Tiêu đề"
          value={current.title}
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />
        <textarea
          placeholder="Mô tả ngắn"
          value={current.excerpt}
          onChange={(e) => setCurrent({ ...current, excerpt: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          placeholder="Link ảnh cover"
          value={current.cover}
          onChange={(e) => setCurrent({ ...current, cover: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
        />

        {/* Block form */}
        <h2 className="text-lg font-semibold mb-2">
          {editingBlockIndex !== null ? "✏️ Sửa block" : "➕ Thêm block"}
        </h2>

        <select
          value={block.type}
          onChange={(e) => setBlock({ type: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="heading">Heading</option>
          <option value="paragraph">Paragraph</option>
          <option value="image">Image</option>
          <option value="list">List</option>
          <option value="quote">Quote</option>
          <option value="gallery">Gallery</option>
          <option value="video">Video</option>
        </select>

        {block.type === "heading" && (
          <>
            <input
              placeholder="Cấp (2,3,4)"
              type="number"
              value={block.level || 2}
              onChange={(e) =>
                setBlock({ ...block, level: parseInt(e.target.value) })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              placeholder="Text"
              value={block.text || ""}
              onChange={(e) => setBlock({ ...block, text: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
          </>
        )}

        {block.type === "paragraph" && (
          <textarea
            placeholder="Text"
            value={block.text || ""}
            onChange={(e) => setBlock({ ...block, text: e.target.value })}
            className="w-full border p-2 mb-2 rounded"
          />
        )}

        {block.type === "image" && (
          <>
            <input
              placeholder="URL ảnh"
              value={block.url || ""}
              onChange={(e) => setBlock({ ...block, url: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              placeholder="Alt"
              value={block.alt || ""}
              onChange={(e) => setBlock({ ...block, alt: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              placeholder="Caption"
              value={block.caption || ""}
              onChange={(e) => setBlock({ ...block, caption: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
          </>
        )}

        {block.type === "list" && (
          <>
            <select
              value={block.style || "unordered"}
              onChange={(e) => setBlock({ ...block, style: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            >
              <option value="unordered">Unordered</option>
              <option value="ordered">Ordered</option>
            </select>
            <textarea
              placeholder="Nhập các item, xuống dòng để ngăn cách"
              value={block.items ? block.items.join("\n") : ""}
              onChange={(e) =>
                setBlock({ ...block, items: e.target.value.split("\n") })
              }
              className="w-full border p-2 mb-2 rounded"
            />
          </>
        )}

        {block.type === "quote" && (
          <>
            <textarea
              placeholder="Quote text"
              value={block.text || ""}
              onChange={(e) => setBlock({ ...block, text: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              placeholder="By"
              value={block.by || ""}
              onChange={(e) => setBlock({ ...block, by: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
          </>
        )}

        {block.type === "gallery" && (
          <textarea
            placeholder="Nhập nhiều URL ảnh (mỗi dòng 1 link)"
            value={block.images ? block.images.map((i) => i.url).join("\n") : ""}
            onChange={(e) =>
              setBlock({
                ...block,
                images: e.target.value
                  .split("\n")
                  .map((url) => ({ url: url.trim() })),
              })
            }
            className="w-full border p-2 mb-2 rounded"
          />
        )}

        {block.type === "video" && (
          <>
            <input
              placeholder="Video URL"
              value={block.url || ""}
              onChange={(e) => setBlock({ ...block, url: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              placeholder="Caption"
              value={block.caption || ""}
              onChange={(e) => setBlock({ ...block, caption: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
          </>
        )}

        <button
          onClick={saveBlock}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {editingBlockIndex !== null ? "Lưu block" : "Thêm block"}
        </button>

        <button
          onClick={saveService}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Lưu bài
        </button>

        <button
          onClick={copyJson}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Copy JSON
        </button>

        {/* Danh sách block */}
        <h3 className="mt-6 font-semibold">Danh sách block:</h3>
        <ul className="list-none pl-0 border rounded divide-y divide-gray-200">
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
              className={`flex justify-between items-center px-3 py-2 ${
                i === editingBlockIndex ? "bg-yellow-100" : "bg-white"
              }`}
              style={{
                borderTop:
                  dragOverIndex === i ? "3px solid #3b82f6" : "1px solid transparent",
                paddingTop: dragOverIndex === i ? 14 : 8, // tạo cảm giác "đẩy xuống"
                transition: "padding 120ms ease",
                cursor: "grab",
              }}
            >
              {/* click vào label để chọn & cuộn preview */}
              <button
                className="text-left flex-1 truncate"
                title={labelOfBlock(b)}
                onClick={() => editBlock(i)}
              >
                <span className="capitalize">{labelOfBlock(b)}</span>
              </button>

              <div className="flex items-center gap-3 pl-3 shrink-0">
                <button
                  onClick={() => i > 0 && handleDrop(i, i - 1)}
                  className="text-gray-500 hover:text-black"
                  title="Di chuyển lên"
                >
                  ↑
                </button>
                <button
                  onClick={() =>
                    i < current.blocks.length - 1 && handleDrop(i, i + 1)
                  }
                  className="text-gray-500 hover:text-black"
                  title="Di chuyển xuống"
                >
                  ↓
                </button>
                <button
                  onClick={() => editBlock(i)}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteBlock(i)}
                  className="text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Right: Preview --- */}
      <div className="border-l pl-4 overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Xem trước</h2>
        <Preview
          service={current}
          previewRefs={previewRefs}
          onClickBlock={(i) => editBlock(i)}
          editingBlockIndex={editingBlockIndex}
        />
      </div>
    </div>
  );
}

// Preview giống ServiceDetail
function Preview({ service, previewRefs, onClickBlock, editingBlockIndex }) {
  if (!service) return null;

  return (
    <div className="max-w-full px-2">
      {service.cover && (
        <img
          src={service.cover}
          alt={service.title}
          className="w-full h-48 object-cover rounded-xl shadow"
        />
      )}
      <h1 className="mt-4 text-2xl font-bold">{service.title}</h1>
      <p className="text-gray-600 mb-4">{service.excerpt}</p>

      {service.blocks?.map((block, i) => {
        const baseProps = {
          key: i,
          ref: (el) => (previewRefs.current[i] = el),
          onClick: () => onClickBlock(i),
          className:
            (i === editingBlockIndex ? "bg-yellow-100 " : "") + "cursor-pointer",
        };

        switch (block.type) {
          case "heading":
            return (
              <h2
                {...baseProps}
                className={baseProps.className + " mt-4 text-xl font-semibold"}
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p {...baseProps} className={baseProps.className + " mb-2"}>
                {block.text}
              </p>
            );
          case "image":
            return (
              <figure {...baseProps} className={baseProps.className + " my-3"}>
                <img src={block.url} alt={block.alt} className="w-full rounded" />
                {block.caption && (
                  <figcaption className="text-sm text-gray-500 text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "list":
            return block.style === "unordered" ? (
              <ul
                {...baseProps}
                className={baseProps.className + " list-disc pl-6 mb-2"}
              >
                {block.items?.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            ) : (
              <ol
                {...baseProps}
                className={baseProps.className + " list-decimal pl-6 mb-2"}
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
                className={baseProps.className + " border-l-4 pl-4 italic my-3"}
              >
                {block.text}
                {block.by && <footer>— {block.by}</footer>}
              </blockquote>
            );
          case "gallery":
            return (
              <div
                {...baseProps}
                className={baseProps.className + " grid grid-cols-2 gap-2 my-3"}
              >
                {block.images?.map((img, j) => (
                  <img
                    key={j}
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            );
          case "video":
            return (
              <div {...baseProps} className={baseProps.className + " my-3"}>
                <iframe
                  src={block.url}
                  title={`video-${i}`}
                  className="w-full h-48 rounded"
                  allowFullScreen
                />
                {block.caption && (
                  <p className="text-sm text-gray-500 text-center">
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
