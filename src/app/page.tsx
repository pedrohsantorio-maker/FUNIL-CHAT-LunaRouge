"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 animate-gradient-xy" />
      <div className="relative z-10 flex flex-col items-center gap-6 rounded-2xl bg-slate-900/60 p-8 text-center text-white shadow-2xl backdrop-blur-lg border border-slate-700/50 max-w-md mx-4 transition-all duration-500 animate-fade-in-up">
        {denied ? (
          <>
            <h1 className="text-2xl font-bold text-amber-400">Acesso Negado</h1>
            <p className="text-slate-300">
              Você precisa ter 18 anos ou mais para continuar.
            </p>
            <Button
              variant="outline"
              className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white"
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight">
              Pronto para receber o melhor conteúdo?
              <span className="ml-2">😈🔥</span>
            </h1>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-200">Confirme sua idade</h2>
              <p className="text-slate-400 mt-1">Você deve ter 18 anos ou mais para continuar.</p>
            </div>
            <div className="flex w-full flex-col sm:flex-row gap-4">
              <Button
                onClick={handleYes}
                className="flex-1 bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 text-lg py-6 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20"
                size="lg"
              >
                Sim, sou maior de 18
              </Button>
              <Button
                onClick={handleNo}
                variant="outline"
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-lg py-6 transition-all duration-300 transform hover:scale-105"
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
