import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatImageUrl } from "@/helpers/imageFormatted";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  const imageUrl = formatImageUrl(productVariant?.imageUrl);

  return (
    <>
      <Header />

      <div className="flex flex-col space-y-6 lg:flex-row lg:gap-10 lg:px-72 lg:py-10">
        <div className="flex flex-col items-center lg:w-1/2">
          <div className="flex w-full flex-col lg:flex-row lg:gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex lg:w-24 lg:flex-col lg:justify-start lg:gap-3">
              {imageUrl && (
                <>
                  <Image
                    src={imageUrl}
                    alt="Thumb 1"
                    width={80}
                    height={80}
                    className="cursor-pointer rounded-lg"
                  />
                  <Image
                    src={imageUrl}
                    alt="Thumb 2"
                    width={80}
                    height={80}
                    className="cursor-pointer rounded-lg"
                  />
                </>
              )}
            </div>

            {/* Imagem Principal */}
            <div className="min-w-0 flex-1">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={productVariant.name}
                  sizes="(min-width:1024px) 600px, 100vw"
                  width={600}
                  height={600}
                  className="h-auto w-full rounded-2xl object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Infos do Produto */}
        <div className="flex flex-col space-y-6 px-5 lg:mt-0 lg:w-1/2">
          {/* Variantes (visível só em mobile/tablet) */}
          <div className="lg:hidden">
            <VariantSelector
              selectedVariant={productVariant.slug}
              variants={productVariant.product.variants}
            />
          </div>

          {/* Nome, categoria e preço */}
          <div>
            <h2 className="text-lg font-semibold lg:text-3xl">
              {productVariant.product.name}
            </h2>

            <h3 className="text-muted-foreground text-sm lg:text-lg">
              {productVariant.name}
            </h3>

            <h3 className="mt-4 text-lg font-semibold lg:text-2xl">
              {formatCentsToBRL(productVariant.priceInCents)}
            </h3>
          </div>

          {/* Variantes (visível só em desktop) */}
          <div className="hidden lg:block">
            <VariantSelector
              selectedVariant={productVariant.slug}
              variants={productVariant.product.variants}
            />
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-3">
            <ProductActions productVariantId={productVariant.id} />
          </div>

          {/* Descrição */}
          <div>
            <p className="text-base leading-relaxed text-shadow-amber-600 lg:text-lg">
              {productVariant.product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ProductList title="Talvez você goste" products={likelyProducts} />
      </div>

      <Footer />
    </>
  );
};

export default ProductVariantPage;
