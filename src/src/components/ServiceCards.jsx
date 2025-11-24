import React from "react";
import ServiceCard from "./ui/ServiceCard";
import services from "../data/services.json";

export default function ServiceCards() {
  return (
    <div className="mx-auto grid max-w-screen-xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 pb-[80px] md:pb-[164px]">
      {services.map((service) => (
        <div key={service.id} className="w-[80%] mx-auto sm:w-full">
          <ServiceCard
            title={service.title}
            description={service.excerpt}
            cover={service.cover}
            slug={service.slug}
          />
        </div>
      ))}
    </div>
  );
}
