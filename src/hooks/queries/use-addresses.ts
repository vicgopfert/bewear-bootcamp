import { useQuery } from "@tanstack/react-query";

import { getAddresses } from "@/actions/get-addresses";

export const getUseAddressesQueryKey = () => ["addresses"] as const;

export const useAddresses = () => {
  return useQuery({
    queryKey: getUseAddressesQueryKey(),
    queryFn: () => getAddresses(),
  });
};
