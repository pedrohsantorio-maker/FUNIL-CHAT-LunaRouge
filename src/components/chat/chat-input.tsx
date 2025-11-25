"use client";

import { useState, useRef, type FC, useEffect } from "react";
import { Paperclip, Mic, Send, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string, type: "text" | "audio") => void;
  isTyping: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isTyping }) => {
  const { toast } = useToast();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Recurso em desenvolvimento",
      description: "Esta funcionalidade ainda não foi implementada.",
    });
  };

  return (
    <div className="p-4 bg-background border-t">
      <div
        className="relative flex items-center justify-center gap-2 p-2 rounded-full bg-secondary text-muted-foreground"
      >
        <p className="text-sm">Apenas opções podem ser selecionadas.</p>
      </div>
    </div>
  );
};
