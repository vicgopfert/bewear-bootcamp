"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export const getAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const addresses = await db.query.shippingAddressTable.findMany({
    where: (sa, { eq }) => eq(sa.userId, session.user.id),
    orderBy: (sa, { desc }) => desc(sa.createdAt),
  });

  return addresses;
};
