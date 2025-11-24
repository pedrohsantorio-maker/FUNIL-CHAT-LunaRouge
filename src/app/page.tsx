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
    <div className="flex h-screen w-screen items-center justify-center bg-black p-4 text-white">
      <div className="flex flex-col items-center gap-8 text-center max-w-lg">
        {denied ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#1a1a1a] p-8 border border-orange-500/20">
            <h1 className="text-2xl font-bold text-orange-500">Acesso Negado</h1>
            <p className="text-slate-400">
              Você precisa ter 18 anos ou mais para continuar.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
              onClick={() => setDenied(false)}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">Pronto para receber o </span>
              <span className="bg-orange-500 text-black rounded-md px-2 ml-1">melhor</span>
              <span className="text-white"> conteúdo?</span>
            </h1>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-white">Confirme sua idade</h2>
              <p className="text-slate-400">Você deve ter 18 anos ou mais para continuar.</p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-4">
              <Button
                onClick={handleYes}
                className="bg-orange-500 text-black font-bold hover:bg-orange-600 text-lg py-6 transition-all duration-300 rounded-md"
                size="lg"
              >
                Sim, sou maior de 18
              </Button>
              <Button
                onClick={handleNo}
                variant="secondary"
                className="bg-[#222] text-white hover:bg-[#333] text-lg py-6 transition-all duration-300 rounded-md"
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
