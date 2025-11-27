"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface FinalCtaProps {
  href: string;
  onConversion: () => void;
}

export function FinalCta({ href, onConversion }: FinalCtaProps) {
  return (
    <div className="p-4 bg-background border-t animate-fade-in-up">
      <Link href={href} target="_blank" rel="noopener noreferrer" onClick={onConversion} className="block">
        <Button
          size="lg"
          className="w-full h-16 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(255,153,0,0.5)] hover:shadow-[0_0_30px_rgba(255,153,0,0.7)] hover:bg-primary/90 transition-all duration-300 animate-[pulse_2s_infinite]"
        >
          <Sparkles className="mr-3 h-6 w-6" />
          Acessar Conteúdo Exclusivo
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
