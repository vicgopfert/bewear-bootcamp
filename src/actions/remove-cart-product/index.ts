"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>,
) => {
  removeProductFromCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  let cartId = cart?.id;

  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();
    cartId = newCart.id;
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new Error("Product variant not found in cart");
  }

  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
