"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(1, "Obrigatório"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(11, "CPF inválido"),
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

const Addressess = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);

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

  const onSubmit = (values: FormValues) => {
    return values;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={(value) => setSelectedAddress(value)}>
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

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
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                <Button type="submit" className="w-full md:w-auto">
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
