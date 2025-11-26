"use client";

import { useRef, useEffect, type FC } from "react";
import type { Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import placeholderData from "@/lib/placeholder-images.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onOptionSelect: (value: string, text: string) => void;
  onConversion: () => void;
}

const sterAvatar = placeholderData.placeholderImages.find(
  (img) => img.id === "ster-avatar"
);

export const MessageList: FC<MessageListProps> = ({
  messages,
  isTyping,
  onOptionSelect,
  onConversion,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          const hasOptions = message.options && message.options.length > 0;
          return (
            <div key={message.id}>
              <MessageBubble
                message={message}
                onConversion={onConversion}
              />
              {hasOptions && (
                <div className="flex flex-col items-end gap-2 mt-2 animate-message-in" style={{ animationDelay: '1000ms'}}>
                  {message.options?.map((option, index) => (
                    <Button
                      key={option.value}
                      onClick={() => onOptionSelect?.(option.value, option.text)}
                      variant="outline"
                      className="justify-start bg-background hover:bg-accent h-auto py-2 whitespace-normal text-left max-w-[75%] rounded-2xl rounded-br-none border-primary/50 text-primary hover:text-accent-foreground animate-message-in"
                      style={{ animationDelay: `${1000 + index * 200}ms` }}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar className="h-8 w-8">
              {sterAvatar && <AvatarImage src={sterAvatar.imageUrl} alt="Ster" />}
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="bg-card text-card-foreground rounded-2xl px-4 py-2 rounded-bl-none">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};
