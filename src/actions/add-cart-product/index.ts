"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

/**
 * Adiciona um produto (variant) ao carrinho do usuário autenticado.
 *
 * @param data Dados validados contendo o `productVariantId` e `quantity`
 *
 * Passos:
 * 1. Valida os dados recebidos.
 * 2. Obtém a sessão e garante que o usuário esteja autenticado.
 * 3. Busca o `productVariant` para garantir que ele existe.
 * 4. Verifica se o usuário já tem um carrinho; caso não, cria um novo.
 * 5. Caso o item já exista no carrinho, aumenta a quantidade.
 * 6. Caso contrário, insere o novo item.
 */

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Corrigido: busca a variante do produto na tabela certa
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (pv, { eq }) => eq(pv.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
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
    where: (ci, { eq, and }) =>
      and(
        eq(ci.cartId, cartId),
        eq(ci.productVariantId, data.productVariantId),
      ),
  });

  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({ quantity: cartItem.quantity + data.quantity })
      .where(eq(cartItemTable.id, cartItem.id));

    return;
  }

  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: productVariant.id,
    quantity: data.quantity,
  });
};
