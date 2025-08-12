import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/components/common/header";
import Orders from "./components/orders";
import { formatImageUrl } from "@/helpers/imageFormatted";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session?.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-5">
      <Header />

      <div className="px-5">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id ?? "",
              imageUrl: formatImageUrl(item.productVariant?.imageUrl ?? ""),
              productName: item.productVariant?.product.name ?? "",
              productVariantName: item.productVariant?.name ?? "",
              priceInCents: item.productVariant?.priceInCents ?? 0,
              quantity: item.quantity,
            })),
          }))}
        />
      </div>
    </div>
  );
};

export default MyOrdersPage;
