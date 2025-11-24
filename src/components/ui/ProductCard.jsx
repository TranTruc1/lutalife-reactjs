import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function ProductCard({ product }) {
  // ✅ SỬA: Hiển thị 2 số thập phân (ví dụ $149.00)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2
    }).format(amount);
  };

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group h-full relative flex flex-col overflow-hidden rounded-lg md:rounded-3xl bg-white shadow-sm md:shadow-md border border-gray-100">
      
      <Link 
        to={`/product/${product.slug}`} 
        className="block relative w-full aspect-[16/9] md:aspect-auto md:h-[260px] overflow-hidden bg-[#F2F7FF]"
      >
        <img
          src={product.cover}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {discount > 0 && (
          <div className="absolute top-1 right-1 md:top-4 md:right-4 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] md:text-xs font-bold text-white shadow-sm z-10">
            -{discount}%
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2 md:p-6">
        <Link to={`/product/${product.slug}`}>
          <h3 className="mb-1 md:mb-2 font-poppins text-[11px] md:text-lg font-semibold text-[#031432] leading-tight line-clamp-2 group-hover:text-[#1678F2] transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="mb-2 text-sm text-gray-500 line-clamp-2 hidden md:block">
          {product.excerpt}
        </p>

        <div className="mt-auto mb-1 md:mb-5 flex flex-col md:flex-row md:items-end gap-0 md:gap-3">
          <span className="text-xs md:text-xl font-bold text-[#1678F2]">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > 0 && (
            <span className="text-[9px] md:text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <Link to={`/product/${product.slug}`} className="w-full mt-1">
          <button className="flex w-full items-center justify-center gap-1 rounded md:rounded-full bg-gradient-to-r from-[#65A8FB] to-[#1678F2] py-1.5 md:py-3 text-[10px] md:text-sm font-bold text-white shadow hover:opacity-90 transition-all">
            <span>Buy</span> 
            <FaArrowRight className="hidden md:block"/>
          </button>
        </Link>
      </div>
    </div>
  );
}