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
import { VideoPlayer } from "./video-player";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface MessageBubbleProps {
  message: Message;
}

const botImage = placeholderData.placeholderImages.find(
  (img) => img.id === "bot-image-message"
);

export const MessageBubble: FC<MessageBubbleProps> = ({
  message,
}) => {
  const isBot = message.sender === "bot";

  const renderContent = () => {
    switch (message.type) {
      case "text":
      case "options":
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      case "image":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={message.content || botImage?.imageUrl || ""}
                alt={botImage?.description || "Image from bot"}
                data-ai-hint={botImage?.imageHint || ""}
                width={400}
                height={300}
                className="rounded-lg object-cover cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="p-0 border-0 max-w-fit bg-transparent">
              <DialogTitle className="sr-only">Imagem enviada por Luna Rouge</DialogTitle>
              <DialogDescription className="sr-only">
                Uma imagem ampliada enviada no chat por Luna Rouge.
              </DialogDescription>
              <Image
                src={message.content || botImage?.imageUrl || ""}
                alt={botImage?.description || "Image from bot"}
                width={800}
                height={800}
                className="rounded-lg object-contain"
              />
            </DialogContent>
          </Dialog>
        );
      case "audio":
        return <AudioPlayer src={message.content} />;
      case "video":
        return <VideoPlayer src={message.content} />;
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
                <p className="font-bold text-primary">{message.linkTitle || "Acesso Exclusivo"}</p>
                <div className="flex items-center gap-2 mt-2 text-primary font-semibold">
                  <span>Ir para o site</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </a>
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
            ? "bg-secondary text-foreground rounded-bl-none"
            : "bg-primary text-primary-foreground rounded-br-none",
           (message.type === 'video' || message.type === 'image' || message.type === 'link') && 'p-0 bg-transparent'
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
};
