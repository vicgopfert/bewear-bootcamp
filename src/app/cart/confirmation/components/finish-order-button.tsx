"use client";

import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FinishOrderButton = () => {
  const [successDialogIsOpen, setSuccessDialogisOpen] = useState(false);
  const finishOrderMutation = useFinishOrder();

  const handleFinishOrder = async () => {
    const { orderId } = await finishOrderMutation.mutateAsync();
    if (!orderId) {
      throw new Error("Failed to create order");
    }

    const checkoutSession = await createCheckoutSession({ orderId });

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("Stripe publishable key is not configured");
    }

    const stripe = await loadStripe(publishableKey);
    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }

    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    setSuccessDialogisOpen(true);
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Finalizar compra
      </Button>

      <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogisOpen}>
        <DialogContent className="flex flex-col items-center text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />

          <DialogTitle className="mt-4 text-2xl">Pedido efeituado!</DialogTitle>

          <DialogDescription className="font-semibold">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>

          <DialogFooter className="flex w-full justify-center gap-2">
            <Button className="rounded-full" size="lg">
              Ver meus pedidos
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrderButton;
