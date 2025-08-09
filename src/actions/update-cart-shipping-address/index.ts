"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  type UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
  data: UpdateCartShippingAddressSchema,
) => {
  updateCartShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const address = await db.query.shippingAddressTable.findFirst({
    where: (sa, { eq }) => eq(sa.id, data.shippingAddressId),
  });

  if (!address) {
    throw new Error("Shipping address not found");
  }

  if (address.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    await db.insert(cartTable).values({
      userId: session.user.id,
      shippingAddressId: data.shippingAddressId,
    });
    return;
  }

  await db
    .update(cartTable)
    .set({ shippingAddressId: data.shippingAddressId })
    .where(eq(cartTable.id, cart.id));
};
