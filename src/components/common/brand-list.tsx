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
  ];

  const loopBrands = [...brands, ...brands];
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          x: "-50%",
          transition: { duration: 20, ease: "linear" },
        });
        controls.set({ x: 0 });
      }
    };

    animate();
  }, [controls]);

  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Marcas parceiras</h3>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex w-max gap-0"
          ref={containerRef}
          animate={controls}
        >
          {loopBrands.map((brand, index) => (
            <div
              key={index}
              className="flex max-w-[128px] min-w-[128px] flex-col items-center"
            >
              <Card className="flex h-24 w-24 items-center justify-center rounded-4xl px-5">
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={brand.image}
                    alt={`Logo da ${brand.name}`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </CardContent>
              </Card>
              <p className="mt-2 h-5 w-full truncate text-center text-sm font-medium">
                {brand.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BrandList;
