"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderTable } from "@/db/schema";
import { formatImageUrl } from "@/helpers/imageFormatted";
import { formatCentsToBRL } from "@/helpers/money";
import Image from "next/image";

interface OrdersProps {
  orders: Array<{
    id: string;
    totalPriceInCents: number;
    status: (typeof orderTable.$inferSelect)["status"];
    createdAt: Date;
    items: Array<{
      id: string;
      imageUrl: string;
      productName: string;
      productVariantName: string;
      priceInCents: number;
      quantity: number;
    }>;
  }>;
}

const Orders = ({ orders }: OrdersProps) => {
  return (
    <>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible key={order.id}>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col gap-1">
                    {order.status === "paid" && <Badge>PAGO</Badge>}
                    {order.status === "pending" && (
                      <Badge variant="outline">PENDENTE</Badge>
                    )}
                    {order.status === "canceled" && (
                      <Badge variant="destructive">CANCELADO</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p>
                      Pedido feito em{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {order.items.map((product) => (
                    <div
                      className="flex items-center justify-between space-y-4"
                      key={product.id}
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={formatImageUrl(product.imageUrl)}
                          alt={product.productName}
                          width={78}
                          height={78}
                          className="rounded-lg"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold">
                            {product.productName}
                          </p>
                          <p className="text-muted-foreground text-xs font-medium">
                            {product.productVariantName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2">
                        <p className="text-xs font-semibold">
                          {formatCentsToBRL(
                            product.priceInCents * product.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="py-3">
                    <Separator />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Subtotal</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Frete</p>
                      <p className="text-sm font-medium text-green-500">
                        GRÁTIS
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Total</p>
                      <p className="text-sm font-bold">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default Orders;
