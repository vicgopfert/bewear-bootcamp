import { useQuery } from "@tanstack/react-query";

import { getAddresses } from "@/actions/get-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUseAddressesQueryKey = () => ["addresses"] as const;

export const useAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUseAddressesQueryKey(),
    queryFn: () => getAddresses(),
    initialData: params?.initialData,
  });
};
