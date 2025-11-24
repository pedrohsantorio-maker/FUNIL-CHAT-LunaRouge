"use client";

import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Message, MessageOption } from "@/lib/types";
import { AudioPlayer } from "./audio-player";
import placeholderData from "@/lib/placeholder-images.json";
import { ExternalLink } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  onOptionSelect?: (value: string) => void;
}

const botImage = placeholderData.placeholderImages.find(
  (img) => img.id === "bot-image-message"
);

export const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  onOptionSelect,
}) => {
  const isBot = message.sender === "bot";

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      case "image":
        return (
          <Image
            src={botImage?.imageUrl || ""}
            alt={botImage?.description || "Image from bot"}
            data-ai-hint={botImage?.imageHint || ""}
            width={400}
            height={300}
            className="rounded-lg object-cover"
          />
        );
      case "audio":
        return <AudioPlayer src={message.content} />;
      case "link":
        return (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-secondary hover:bg-secondary/80">
              <CardContent className="p-4">
                <p className="font-bold text-primary">Acesso Exclusivo</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">
                  {message.content}
                </p>
                <div className="flex items-center gap-2 mt-2 text-primary font-semibold">
                  <span>Ir para o site</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </a>
        );
      case "options":
        return (
          <div>
            <p className="mb-2">{message.content}</p>
            <div className="flex flex-col gap-2">
              {message.options?.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onOptionSelect?.(option.value)}
                  variant="outline"
                  className="justify-start"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 animate-message-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8 self-start">
          {message.avatar && <AvatarImage src={message.avatar} alt={message.name} />}
          <AvatarFallback>{message.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2",
          isBot
            ? "bg-card text-card-foreground rounded-bl-none"
            : "bg-primary text-primary-foreground rounded-br-none"
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
};
