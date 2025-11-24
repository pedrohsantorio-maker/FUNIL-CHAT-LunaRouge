"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AgeGatePage() {
  const router = useRouter();
  const [denied, setDenied] = useState(false);

  const handleYes = () => {
    router.push("/chats");
  };

  const handleNo = () => {
    setDenied(true);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#1d1120] via-[#461834] to-[#c22a84] p-4 text-white">
      <div className="flex flex-col items-center gap-8 text-center max-w-lg">
        {denied ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-black/20 p-8">
            <h1 className="text-2xl font-bold text-pink-500">Acesso Negado</h1>
            <p className="text-slate-300">
              Você precisa ter 18 anos ou mais para continuar.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              onClick={() => setDenied(false)}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold tracking-tight text-pink-400">
              Pronto para receber o melhor conteúdo?
              <span className="ml-2">😈🔥</span>
            </h1>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">Confirme sua idade</h2>
              <p className="text-slate-300">Você deve ter 18 anos ou mais para continuar.</p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-4">
              <Button
                onClick={handleYes}
                className="bg-pink-500 text-white font-bold hover:bg-pink-600 text-lg py-6 transition-all duration-300 rounded-full"
                size="lg"
              >
                Sim, sou maior de 18
              </Button>
              <Button
                onClick={handleNo}
                variant="secondary"
                className="bg-black text-white hover:bg-gray-800 text-lg py-6 transition-all duration-300 rounded-full"
                size="lg"
              >
                Não sou maior de 18
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
