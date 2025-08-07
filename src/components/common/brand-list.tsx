import Image from "next/image";

import { Card, CardContent } from "../ui/card";

const BrandList = () => {
  const brands = [
    { image: "/brands/brand-nike.svg", name: "Nike" },
    { image: "/brands/brand-adidas.svg", name: "Adidas" },
    { image: "/brands/brand-puma.svg", name: "Puma" },
    { image: "/brands/brand-newbalance.svg", name: "New Balance" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Marcas parceiras</h3>

      <div className="flex w-full gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex max-w-[128px] min-w-[128px] flex-col items-center"
          >
            <Card className="flex h-24 w-24 items-center justify-center rounded-4xl">
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
      </div>
    </div>
  );
};

export default BrandList;
