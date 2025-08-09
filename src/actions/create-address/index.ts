"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { CreateAddressSchema, createAddressSchema } from "./schema";

export const createAddress = async (data: CreateAddressSchema) => {
  createAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [inserted] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: data.fullName,
      street: data.address,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      state: data.state,
      neighborhood: data.district,
      zipCode: data.zipCode,
      country: "BR",
      phone: data.cellphone,
      email: data.email,
      cpfOrCnpj: data.cpf,
    })
    .returning();

  return inserted;
};

