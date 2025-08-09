import { useMutation } from "@tanstack/react-query";

import { createAddress } from "@/actions/create-address";
import type { CreateAddressSchema } from "@/actions/create-address/schema";

export const getCreateAddressMutationKey = () => ["create-address"] as const;

export const useCreateAddress = () => {
  return useMutation({
    mutationKey: getCreateAddressMutationKey(),
    mutationFn: (data: CreateAddressSchema) => createAddress(data),
  });
};

