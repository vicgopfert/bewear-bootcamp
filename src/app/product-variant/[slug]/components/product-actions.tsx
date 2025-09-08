"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="mb-4 lg:mb-6">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-lg border">
            <Button size="icon" variant="ghost" onClick={handleDecrement}>
              <MinusIcon />
            </Button>

            <p>{quantity}</p>

            <Button size="icon" variant="ghost" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* Wrapper do AddToCartButton */}
        <div className="w-full">
          <AddToCartButton
            productVariantId={productVariantId}
            quantity={quantity}
          />
        </div>

        {/* Wrapper do Button */}
        <div className="w-full">
          <Button className="w-full rounded-full" size="lg">
            Comprar agora
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductActions;
