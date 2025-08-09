import { shippingAddressTable } from "@/db/schema";

export const formatAddress = (
  address: typeof shippingAddressTable.$inferSelect,
) => {
  const complementPart = address.complement ? `, ${address.complement}` : "";
  return `${address.recipientName}, ${address.street}, ${address.number}${complementPart}, ${address.neighborhood}, ${address.city} - ${address.state}`;
};
