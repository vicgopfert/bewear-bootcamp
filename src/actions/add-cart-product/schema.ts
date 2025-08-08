import z from "zod"; // Biblioteca para validação de dados

// Esquema de validação para adicionar produto ao carrinho
export const addProductToCartSchema = z.object({
  productVariantId: z.uuid(), // ID do produto (formato UUID)
  quantity: z.number().min(1), // Quantidade (mínimo 1)
});

// Tipo TypeScript baseado no esquema acima
export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
