import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Import dữ liệu từ file JSON bên ngoài
import products from "../data/products.json";
import Navbar from "./Navbar";
import ProductOrderForm from "./ProductOrderForm";
import { 
  FaCartPlus, FaMinus, FaPlus, FaPhoneAlt, 
  FaShieldAlt, FaShippingFast 
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset ảnh chính về cover khi đổi sản phẩm
    if (product) {
      setMainImage(product.cover);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-40 text-center font-bold text-xl text-gray-800">
          Không tìm thấy sản phẩm
        </div>
      </>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);

  // --- LOGIC SEO ALT THÔNG MINH ---
  const getMainImageAlt = () => {
    // 1. Nếu đang xem ảnh bìa (hoặc chưa chọn ảnh nào) -> Dùng coverAlt (ưu tiên) hoặc Title
    if (!mainImage || mainImage === product.cover) {
      return product.coverAlt || product.title;
    }
    // 2. Nếu đang xem ảnh thumbnail khác -> Dùng Title + số thứ tự
    const index = product.images ? product.images.indexOf(mainImage) : -1;
    return `${product.title} - chi tiết ${index + 1}`;
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-screen-xl px-4">
          
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            
            {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center bg-[#F2F7FF] rounded-2xl overflow-hidden p-6 border border-gray-100 relative group h-[300px] md:h-[450px]">
                 <img 
                   src={mainImage || product.cover} 
                   alt={getMainImageAlt()} // ✅ SEO: Alt động theo ảnh đang xem
                   className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                 />
              </div>

              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`
                        cursor-pointer flex-shrink-0 w-20 h-20 bg-white rounded-xl border-2 p-1
                        ${mainImage === img ? "border-[#1678F2]" : "border-gray-100 hover:border-gray-300"}
                      `}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} - ảnh nhỏ ${index + 1}`} // ✅ SEO: Alt cho thumbnail
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN --- */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-[#031432] font-poppins mb-2 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-end gap-4 my-6 border-b border-gray-100 pb-6">
                <span className="text-4xl font-bold text-[#1678F2]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > 0 && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                 {product.originalPrice > product.price && (
                   <span className="mb-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">
                     -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                   </span>
                )}
              </div>

              <p className="text-gray-600 mb-8 text-lg">{product.excerpt}</p>

              <div className="flex items-center gap-4 mb-8">
                <span className="font-medium text-[#031432]">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-4 bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gray-500 hover:text-[#1678F2]">
                    <FaMinus size={12} />
                  </button>
                  <span className="font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-gray-500 hover:text-[#1678F2]">
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setShowOrderForm(true)}
                  className="flex-1 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#65A8FB] to-[#1678F2] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
                >
                  <FaCartPlus className="size-6" /> Đặt Hàng Ngay
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-green-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">100% Chính Hãng</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <FaShippingFast className="text-blue-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">Free Ship US</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-orange-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">Kiểm tra khi nhận</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-red-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">Hỗ trợ 24/7</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#031432] mb-6 border-l-4 border-[#1678F2] pl-4" >
              Thông Tin Chi Tiết
            </h2>
            <div className="prose max-w-none text-gray-700">
              {product.blocks?.map((block, index) => {
                if (block.type === "heading") {
                    const level = block.level || 2;
                    if (level === 2) return <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-800">{block.text}</h3>;
                    return <h4 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-800">{block.text}</h4>;
                }
                if (block.type === "paragraph") return <p key={index} className="mb-4 leading-relaxed text-justify">{block.text}</p>;
                if (block.type === "list") return (
                  <ul key={index} className="list-disc pl-6 mb-4 space-y-2 marker:text-[#1678F2]">
                    {block.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
                // ✅ SEO: Xử lý ảnh trong bài viết, ưu tiên alt riêng -> alt cover -> title
                if (block.type === "image") return (
                  <figure key={index} className="my-6">
                    <img 
                      src={block.url} 
                      alt={block.alt || product.coverAlt || product.title} 
                      className="w-full rounded-xl shadow"
                    />
                    {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{block.caption}</figcaption>}
                  </figure>
                );
                return null;
              })}
            </div>
          </div>

        </div>
      </div>

      {showOrderForm && (
        <ProductOrderForm 
          product={product} 
          quantity={quantity} 
          onClose={() => setShowOrderForm(false)} 
        />
      )}
    </>
  );
}