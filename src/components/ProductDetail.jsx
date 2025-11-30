import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products.json";
import Navbar from "./Navbar";
import ProductOrderForm from "./ProductOrderForm";
import { 
  FaCartPlus, FaMinus, FaPlus, FaPhoneAlt, 
  FaShieldAlt, FaShippingFast, FaTimes, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // State Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- STATE CHO VUỐT MƯỢT (CAROUSEL) ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0); 
  const [isSwiping, setIsSwiping] = useState(false); // True khi đang kéo tay hoặc đang reset vị trí
  const containerRef = useRef(null); 
  
  const minSwipeDistance = 50; 

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
        <div className="pt-40 text-center font-bold text-xl text-gray-800">
          Không tìm thấy sản phẩm
        </div>
      </>
    );
  }

  // ✅ CẬP NHẬT: Hiển thị 2 số thập phân (minimumFractionDigits: 2)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);

  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.cover];

  const currentIndex = allImages.indexOf(mainImage) !== -1 
    ? allImages.indexOf(mainImage) 
    : 0;

  const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  const nextIndex = (currentIndex + 1) % allImages.length;

  const prevImageSrc = allImages[prevIndex];
  const nextImageSrc = allImages[nextIndex];

  // Logic chuyển ảnh (Gọi sau khi animation kết thúc)
  const handleNextImage = () => {
    setMainImage(nextImageSrc);
  };

  const handlePrevImage = () => {
    setMainImage(prevImageSrc);
  };

  // --- TOUCH HANDLERS ---
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true); // Tắt transition để kéo mượt theo ngón tay
  };

  const onTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    if (touchStart !== null) {
      setSwipeOffset(currentX - touchStart);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
        setSwipeOffset(0);
        setIsSwiping(false);
        return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 300;

    if (isLeftSwipe || isRightSwipe) {
       // 1. ANIMATION: Trượt hết phần còn lại (Slide to Finish)
       setIsSwiping(false); // Bật lại transition
       // Đẩy ảnh sang hẳn bên trái (-width) hoặc phải (+width)
       setSwipeOffset(isLeftSwipe ? -containerWidth : containerWidth);

       // 2. LOGIC: Đợi animation xong (300ms) thì đổi ảnh thật và reset vị trí
       setTimeout(() => {
          // Tắt transition để reset vị trí không bị giật ngược lại
          setIsSwiping(true); 
          
          if (isLeftSwipe) handleNextImage();
          else handlePrevImage();
          
          setSwipeOffset(0); // Đưa offset về 0 ngay lập tức (khi ảnh đã đổi)

          // Bật lại trạng thái bình thường sau 1 tích tắc
          setTimeout(() => setIsSwiping(false), 50);
       }, 300); // Thời gian khớp với transition css (0.3s)

    } else {
       // Nếu kéo chưa đủ xa -> Trượt về vị trí cũ (Snap back)
       setIsSwiping(false);
       setSwipeOffset(0);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-16 md:pt-24 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-screen-xl px-4">
          
          <div className="bg-white rounded-3xl shadow-sm p-4 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-4 md:mt-8">
            
            {/* --- CỘT TRÁI: CAROUSEL ẢNH --- */}
            <div className="flex flex-col gap-4 w-full max-w-full">
              <div 
                ref={containerRef}
                className="relative flex items-center justify-center bg-[#F2F7FF] rounded-2xl overflow-hidden p-0 border border-gray-100 group h-[350px] md:h-[450px] cursor-zoom-in touch-pan-y"
                onClick={() => setIsLightboxOpen(true)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                 {/* 1. Ảnh TRƯỚC */}
                 <div 
                    className="absolute top-0 w-full h-full p-4 md:p-6 flex items-center justify-center pointer-events-none"
                    style={{ left: '-100%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
                 >
                    <img src={prevImageSrc} alt="prev" className="w-full h-full object-contain opacity-50" />
                 </div>

                 {/* 2. Ảnh HIỆN TẠI */}
                 <div 
                    className="absolute top-0 w-full h-full p-4 md:p-6 flex items-center justify-center"
                    style={{ left: '0%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
                 >
                    <img src={mainImage} alt={product.title} className="w-full h-full object-contain select-none" />
                 </div>

                 {/* 3. Ảnh SAU */}
                 <div 
                    className="absolute top-0 w-full h-full p-4 md:p-6 flex items-center justify-center pointer-events-none"
                    style={{ left: '100%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
                 >
                    <img src={nextImageSrc} alt="next" className="w-full h-full object-contain opacity-50" />
                 </div>
                 
                 <div className="absolute bottom-2 right-2 md:hidden bg-black/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10">
                    Chạm để phóng to
                 </div>
              </div>

              {/* Danh sách ảnh nhỏ */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
                  {product.images.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`
                        cursor-pointer flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border-2 p-1 transition-all
                        ${mainImage === img ? "border-[#1678F2] scale-105" : "border-gray-100 hover:border-gray-300"}
                      `}
                    >
                      <img 
                        src={img} 
                        alt={`thumbnail ${index}`} 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN --- */}
            <div className="flex flex-col w-full">
              <h1 className="text-xl md:text-3xl font-bold text-[#031432] font-poppins mb-2 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-end gap-4 my-4 md:my-6 border-b border-gray-100 pb-6">
                <span className="text-3xl md:text-4xl font-bold text-[#1678F2]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > 0 && (
                  <span className="text-lg md:text-xl text-gray-400 line-through mb-1">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                 {product.originalPrice > product.price && (
                   <span className="mb-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">
                     -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                   </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">{product.excerpt}</p>

              <div className="flex items-center gap-4 mb-6 md:mb-8">
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

              <div className="grid grid-cols-2 gap-3 md:gap-4 bg-gray-50 p-4 md:p-5 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-2 md:gap-3">
                    <FaShieldAlt className="text-green-500 text-lg md:text-xl flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">100% Chính Hãng</span>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3">
                    <FaShippingFast className="text-blue-500 text-lg md:text-xl flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Free Ship US</span>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3">
                    <IoCheckmarkCircle className="text-orange-500 text-lg md:text-xl flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Kiểm tra khi nhận</span>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3">
                    <FaPhoneAlt className="text-red-500 text-lg md:text-xl flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Hỗ trợ 24/7</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 bg-white rounded-3xl p-4 md:p-10 shadow-sm overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold text-[#031432] mb-6 border-l-4 border-[#1678F2] pl-4" >
              Thông Tin Chi Tiết
            </h2>
            <div className="prose max-w-none text-gray-700 text-sm md:text-base">
              {product.blocks?.map((block, index) => {
                if (block.type === "heading") {
                    const level = block.level || 2;
                    if (level === 2) return <h3 key={index} className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-gray-800">{block.text}</h3>;
                    return <h4 key={index} className="text-lg md:text-xl font-bold mt-5 md:mt-6 mb-2 md:mb-3 text-gray-800">{block.text}</h4>;
                }
                if (block.type === "paragraph") return <p key={index} className="mb-4 leading-relaxed text-justify">{block.text}</p>;
                if (block.type === "list") return (
                  <ul key={index} className="list-disc pl-5 md:pl-6 mb-4 space-y-2 marker:text-[#1678F2]">
                    {block.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
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

      {/* ✅ LIGHTBOX (Bấm ra ngoài để đóng) */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 flex flex-col justify-center items-center animate-fade-in touch-none"
          onClick={() => setIsLightboxOpen(false)} // ✅ SỬA: Click nền đen để đóng
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 z-50 bg-black/20 rounded-full backdrop-blur-md"
          >
            <FaTimes size={30} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} // Ngăn click xuyên qua làm đóng lightbox
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/10 rounded-full hover:bg-white/20 hidden md:block"
          >
            <FaChevronLeft size={30} />
          </button>

          {/* Wrapper ảnh để bắt sự kiện vuốt riêng, click vào ảnh KHÔNG đóng */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()} // ✅ SỬA: Click vào ảnh không đóng
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
             <div 
                className="absolute w-full h-full flex items-center justify-center p-4"
                style={{ left: '-100%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
             >
                <img src={prevImageSrc} alt="prev" className="max-w-full max-h-full object-contain" />
             </div>

             <div 
                className="absolute w-full h-full flex items-center justify-center p-4"
                style={{ left: '0%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
             >
                <img src={mainImage} alt="current" className="max-w-full max-h-full object-contain shadow-2xl" />
             </div>

             <div 
                className="absolute w-full h-full flex items-center justify-center p-4"
                style={{ left: '100%', transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.3s ease-out' }}
             >
                <img src={nextImageSrc} alt="next" className="max-w-full max-h-full object-contain" />
             </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNextImage(); }} // Ngăn click xuyên qua
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/10 rounded-full hover:bg-white/20 hidden md:block"
          >
            <FaChevronRight size={30} />
          </button>

          <div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex gap-4"
            onClick={(e) => e.stopPropagation()} // Ngăn click vùng thumbnail làm đóng
          >
             {allImages.map((img, idx) => (
               <div 
                 key={idx} 
                 onClick={() => setMainImage(img)}
                 className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
               >
                 <img src={img} alt="thumb" className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
          
          <div className="absolute bottom-10 text-white/50 text-sm md:hidden animate-pulse pointer-events-none">
            Vuốt để xem ảnh khác
          </div>
        </div>
      )}
    </>
  );
}