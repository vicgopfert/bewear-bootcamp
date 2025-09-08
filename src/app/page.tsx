import Image from "next/image";

import BrandList from "@/components/common/brand-list";
import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { getCategories } from "@/data/categories/get-category";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "@/data/products/get-product";

const Home = async () => {
  const [products, newlyCreatedProducts, categories] = await Promise.all([
    getProductsWithVariants(),
    getNewlyCreatedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <Header />

      <div className="space-y-6">
        <div className="px-5">
          {/* Mobile */}
          <Image
            src="/banners/banner-01.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="block h-auto w-full lg:hidden"
          />

          {/* Desktop */}
          <Image
            src="/banners/banner-01-desktop.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="mx-auto hidden h-auto w-full max-w-[1300px] lg:block"
          />
        </div>

        <BrandList />

        <ProductList title="Mais vendidos" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="mb-[-1.75rem] px-5">
          <Image
            src="/banners/banner-02.png"
            alt="Seja autêntico"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList title="Novidades" products={newlyCreatedProducts} />

        <Footer />
      </div>
    </div>
  );
};

export default Home;
