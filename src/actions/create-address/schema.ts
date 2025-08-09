import z from "zod";

export const createAddressSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  cpf: z.string().min(11).max(11),
  cellphone: z.string().min(8),
  zipCode: z.string().min(8),
  address: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional().or(z.literal("")),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;

