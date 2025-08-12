"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { formatAddress } from "@/app/cart/helpers/address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateAddress } from "@/hooks/mutations/use-create-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useAddresses } from "@/hooks/queries/use-addresses";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(1, "Obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  cellphone: z.string().min(1, "Obrigatório"),
  zipCode: z.string().min(1, "Obrigatório"),
  address: z.string().min(1, "Obrigatório"),
  number: z.string().min(1, "Obrigatório"),
  complement: z.string().optional().or(z.literal("")),
  district: z.string().min(1, "Obrigatório"),
  city: z.string().min(1, "Obrigatório"),
  state: z.string().min(1, "Obrigatório"),
});

type FormValues = z.infer<typeof schema>;

interface AddressessProps {
  shippingAddress: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId?: string;
}

const Addressess = ({
  shippingAddress,
  defaultShippingAddressId,
}: AddressessProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    defaultShippingAddressId || undefined,
  );
  const router = useRouter();
  const createAddressMutation = useCreateAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses } = useAddresses({
    initialData: shippingAddress,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      cellphone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newAddress = await createAddressMutation.mutateAsync(values);
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      setSelectedAddress(newAddress.id);
      form.reset();
      toast.success("Endereço salvo com sucesso");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(
        message || "Não foi possível salvar o endereço. Tente novamente.",
      );
    }
  };

  const handleGoToPayment = async () => {
    try {
      if (!selectedAddress || selectedAddress === "add_new") {
        toast.error("Selecione um endereço de entrega.");
        return;
      }
      if (selectedAddress !== defaultShippingAddressId) {
        await updateCartShippingAddressMutation.mutateAsync({
          shippingAddressId: selectedAddress,
        });
      }
      router.push("/cart/confirmation");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(
        message ||
          "Não foi possível avançar para o pagamento. Tente novamente.",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha um endereço de entrega</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selectedAddress}
          onValueChange={(value) => setSelectedAddress(value)}
        >
          {(addresses ?? []).map((address) => (
            <Card key={address.id}>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={address.id}
                    id={`address_${address.id}`}
                  />
                  <Label
                    htmlFor={`address_${address.id}`}
                    className="cursor-pointer text-sm"
                  >
                    {formatAddress(address)}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new" className="cursor-pointer">
                  Adicionar novo endereço
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-6">
            <Button
              className="w-full md:w-auto"
              onClick={handleGoToPayment}
              disabled={updateCartShippingAddressMutation.isPending}
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="###.###.###-##"
                        mask="_"
                        customInput={Input}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        onBlur={field.onBlur}
                        getInputRef={field.ref}
                        name={field.name}
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cellphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="(##) #####-####"
                        mask="_"
                        customInput={Input}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        onBlur={field.onBlur}
                        getInputRef={field.ref}
                        name={field.name}
                        placeholder="(00) 00000-0000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="#####-###"
                        mask="_"
                        customInput={Input}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        onBlur={field.onBlur}
                        getInputRef={field.ref}
                        name={field.name}
                        placeholder="00000-000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, avenida..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={
                    form.formState.isSubmitting ||
                    createAddressMutation.isPending
                  }
                >
                  Salvar endereço
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Addressess;
