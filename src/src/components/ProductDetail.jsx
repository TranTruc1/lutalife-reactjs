import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products.json";
import Navbar from "./Navbar";
import { 
  FaCartPlus, FaMinus, FaPlus, FaPhoneAlt, 
  FaShieldAlt, FaShippingFast 
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
// ✅ Import form đặt hàng mới (thay cho ButtonForm)
import ProductOrderForm from "./ProductOrderForm";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  
  // ✅ State bật/tắt form đặt hàng
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.cover);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-40 text-center font-bold text-xl">Product not found</div>
      </>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);

  return (
    <>
      <Navbar />
      <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-screen-xl px-4">
          
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            
            {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center bg-[#F2F7FF] rounded-2xl overflow-hidden p-6 border border-gray-100 relative group">
                 <img 
                   src={mainImage || product.cover} 
                   alt={product.title} 
                   className="w-full h-[300px] md:h-[450px] object-contain transition-transform duration-500 group-hover:scale-105"
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
                        alt={`thumb-${index}`} 
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
              </div>

              <p className="text-gray-600 mb-8 text-lg">{product.excerpt}</p>

              <div className="flex items-center gap-4 mb-8">
                <span className="font-medium text-[#031432]">Quantity:</span>
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

              {/* ✅ SỬA: Nút bấm mở Form Đặt Hàng (ProductOrderForm) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setShowOrderForm(true)}
                  className="flex-1 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#65A8FB] to-[#1678F2] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
                >
                  <FaCartPlus className="size-6" /> Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-green-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">100% Genuine</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <FaShippingFast className="text-blue-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">Free US Shipping</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-orange-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">Check upon delivery</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-red-500 text-xl" />
                    <span className="text-sm font-medium text-gray-700">24/7 Support</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#031432] mb-6 border-l-4 border-[#1678F2] pl-4">
              Product Details
            </h2>
            <div className="prose max-w-none text-gray-700">
              {product.blocks?.map((block, index) => {
                if (block.type === "heading") return <h3 key={index} className="text-xl font-bold mt-6 mb-2">{block.text}</h3>;
                if (block.type === "paragraph") return <p key={index} className="mb-4 leading-relaxed">{block.text}</p>;
                if (block.type === "list") return (
                  <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                    {block.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
                return null;
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ✅ Render Popup ProductOrderForm khi showOrderForm = true */}
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