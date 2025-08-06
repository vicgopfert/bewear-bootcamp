import Image from "next/image";

import ProductList from "@/components/common/product-list";
import { db } from "@/db";

import { Header } from "../components/common/header";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return (
    <div>
      <Header />

      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banners/banner-01.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList title="Mais vendidos" products={products} />

        <div className="px-5">
          <Image
            src="/banners/banner-02.png"
            alt="Seja autêntico"
            width={0}
            height={0}
            sizes="100vw"
            className="mt-4 h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
