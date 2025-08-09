import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "@/actions/create-address";
import type { CreateAddressSchema } from "@/actions/create-address/schema";
import { getUseAddressesQueryKey } from "@/hooks/queries/use-addresses";

export const getCreateAddressMutationKey = () => ["create-address"] as const;

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateAddressMutationKey(),
    mutationFn: (data: CreateAddressSchema) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseAddressesQueryKey() });
    },
  });
};
