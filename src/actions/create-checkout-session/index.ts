"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { formatImageUrl } from "@/helpers/imageFormatted";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);
  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: {
        with: {
          product: true,
        },
      },
    },
  });

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key não configurada");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const lineItems = orderItems.map((orderItem) => {
    const productVariant = orderItem.productVariant;
    if (!productVariant) {
      throw new Error("Order item missing product variant");
    }
    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: `${productVariant.product.name} - ${productVariant.name}`,
          description: productVariant.product.description,
          images: [formatImageUrl(productVariant.imageUrl)],
        },
        unit_amount: orderItem.priceInCents,
      },
      quantity: orderItem.quantity,
    };
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: lineItems,
  });

  return checkoutSession;
};
