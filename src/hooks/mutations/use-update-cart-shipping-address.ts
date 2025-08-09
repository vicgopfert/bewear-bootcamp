import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import type { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUpdateCartShippingAddressMutationKey = (
  shippingAddressId: string,
) => ["update-cart-shipping-address", shippingAddressId] as const;

export const useUpdateCartShippingAddress = (shippingAddressId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(
      shippingAddressId ?? "unknown",
    ),
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
