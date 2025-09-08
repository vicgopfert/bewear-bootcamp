"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Card, CardContent } from "../ui/card";

const BrandList = () => {
  const brands = [
    { image: "/brands/brand-nike.svg", name: "Nike" },
    { image: "/brands/brand-adidas.svg", name: "Adidas" },
    { image: "/brands/brand-puma.svg", name: "Puma" },
    { image: "/brands/brand-newbalance.svg", name: "New Balance" },
    { image: "/brands/brand-converse.svg", name: "Converse" },
    { image: "/brands/brand-polo.svg", name: "Polo" },
    { image: "/brands/brand-zara.svg", name: "Zara" },
  ];

  const loopBrands = [...brands, ...brands, ...brands, ...brands];
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          x: "-50%",
          transition: { duration: 50, ease: "linear" },
        });
        controls.set({ x: 0 });
      }
    };

    animate();
  }, [controls]);

  return (
    <div className="space-y-6">
      <h3 className="px-5 text-lg font-semibold lg:px-72">Marcas parceiras</h3>

      <div className="relative overflow-hidden">
        <motion.div
          ref={containerRef}
          animate={controls}
          className="flex w-max gap-0 lg:hidden lg:w-full lg:justify-between lg:gap-8"
        >
          {/* Mobile */}
          {loopBrands.map((brand, index) => (
            <div
              key={index}
              className="flex max-w-[128px] min-w-[128px] flex-col items-center lg:max-w-[200px] lg:min-w-[200px]"
            >
              <Card className="flex h-24 w-24 items-center justify-center rounded-4xl px-5 lg:h-32 lg:w-48">
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={brand.image}
                    alt={`Logo da ${brand.name}`}
                    width={60}
                    height={60}
                    className="object-contain lg:h-16 lg:w-16"
                  />
                </CardContent>
              </Card>
              <p className="mt-2 h-5 w-full truncate text-center text-sm font-medium lg:text-base">
                {brand.name}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Desktop */}
        <div className="flex hidden w-max gap-0 lg:flex lg:w-full lg:justify-center lg:gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex max-w-[128px] min-w-[128px] flex-col items-center lg:max-w-[158px] lg:min-w-[158px]"
            >
              <Card className="flex h-24 w-24 items-center justify-center rounded-4xl px-5 lg:h-32 lg:w-40">
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={brand.image}
                    alt={`Logo da ${brand.name}`}
                    width={60}
                    height={60}
                    className="object-contain lg:h-16 lg:w-16"
                  />
                </CardContent>
              </Card>
              <p className="mt-2 h-5 w-full truncate text-center text-sm font-medium lg:text-base">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandList;
