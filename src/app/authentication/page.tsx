import Image from "next/image";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-5">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={200} height={52.28} />
      </Link>

      {/* Tabs */}
      <div className="w-full max-w-md">
        <Tabs defaultValue="sign-in">
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="w-1/2">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="w-1/2">
              Criar conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="w-full">
            <SignInForm />
          </TabsContent>

          <TabsContent value="sign-up" className="w-full">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authentication;
