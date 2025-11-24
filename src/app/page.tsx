"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import placeholderData from "@/lib/placeholder-images.json";

export default function AgeGatePage() {
  const router = useRouter();
  const [denied, setDenied] = useState(false);
  const bgImage = placeholderData.placeholderImages.find(
    (img) => img.id === "age-gate-background"
  );

  const handleYes = () => {
    router.push("/chats");
  };

  const handleNo = () => {
    setDenied(true);
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          data-ai-hint={bgImage.imageHint}
          fill
          className="object-cover blur-sm brightness-50"
          priority
        />
      )}
      <div className="relative z-10 flex flex-col items-center gap-6 rounded-lg bg-black/50 p-8 text-center text-primary-foreground shadow-2xl backdrop-blur-md max-w-sm mx-4">
        {denied ? (
          <>
            <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
            <p>
              Você precisa ter mais de 18 anos para acessar este conteúdo.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Você tem mais de 18 anos?</h1>
            <div className="flex w-full gap-4">
              <Button
                onClick={handleYes}
                className="flex-1"
                size="lg"
              >
                Sim
              </Button>
              <Button
                onClick={handleNo}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                Não
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
