import React from "react";
import ProductCard from "./ui/ProductCard";
import products from "../data/products.json";

export default function ProductList() {
  return (
    // ✅ SỬA: Tăng padding-top lên (pt-16) cho mobile để tránh bị các khối xanh ở trên che mất
    <section className="bg-white pt-16 pb-4 md:py-20">
      <div className="mx-auto max-w-screen-xl px-2 md:px-8">
        {/* Tiêu đề section */}
        <div className="mb-4 md:mb-12 text-center">

          <h2 className="font-poppins text-lg md:text-4xl font-bold text-[#031432]">
            Các gói sản phẩm LUTA LIFE
          </h2>

        </div>

        {/* Grid 2 cột cho mobile, 3 cột cho desktop */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}