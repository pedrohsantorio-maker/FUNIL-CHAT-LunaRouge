"use client";

import { type FC } from "react";
import { Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  isTyping: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ isTyping }) => {
  const { toast } = useToast();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Recurso em desenvolvimento",
      description: "Esta funcionalidade ainda não foi implementada.",
    });
  };

  return (
    <div className="p-2 bg-background border-t">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-secondary rounded-full px-4 py-2">
          <span className="text-muted-foreground">Mensagem</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-11 w-11"
          onClick={handleFeatureNotImplemented}
        >
          <Paperclip className="text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-11 w-11"
          onClick={handleFeatureNotImplemented}
        >
          <Mic className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
