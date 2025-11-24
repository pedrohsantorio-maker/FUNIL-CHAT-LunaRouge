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
    <div className="flex h-screen w-screen items-center justify-center bg-black p-4 text-white font-sans">
      <div
        className={cn(
          "flex flex-col items-center gap-8 text-center max-w-lg transition-all duration-500",
          denied ? "animate-fade-in-up" : ""
        )}
      >
        {denied ? (
          <div className="flex flex-col items-center gap-4 rounded-lg bg-[#111] p-8 border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <h1 className="text-2xl font-bold text-orange-500">Acesso Negado</h1>
            <p className="text-slate-400">
              Você precisa ter 18 anos ou mais para continuar.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300"
              onClick={() => setDenied(false)}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-black tracking-tighter animate-fade-in-up [animation-delay:200ms]">
              <span className="text-white">Pronto para receber o </span>
              <span className="bg-[#ff9900] text-black rounded-md px-3 py-1 ml-1">melhor</span>
              <span className="text-white"> conteúdo?</span>
            </h1>
            <div className="flex flex-col items-center gap-2 animate-fade-in-up [animation-delay:400ms]">
              <h2 className="text-lg font-bold text-white">Confirme sua idade</h2>
              <p className="text-slate-400">Você deve ter 18 anos ou mais para continuar.</p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-4 animate-fade-in-up [animation-delay:600ms]">
              <Button
                onClick={handleYes}
                className="bg-[#ff9900] text-black font-bold hover:bg-[#ffaa22] text-lg py-6 transition-all duration-300 rounded-md shadow-[0_0_20px_rgba(255,153,0,0.5)] hover:shadow-[0_0_30px_rgba(255,153,0,0.7)] animate-[pulse_2s_infinite]"
                size="lg"
              >
                Sim, sou maior de 18
              </Button>
              <Button
                onClick={handleNo}
                variant="secondary"
                className="bg-[#222] text-slate-300 hover:bg-[#333] hover:text-white text-lg py-6 transition-all duration-300 rounded-md"
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
