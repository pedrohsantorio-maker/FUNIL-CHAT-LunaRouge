"use client";

import { useRef, useEffect, type FC } from "react";
import type { Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import placeholderData from "@/lib/placeholder-images.json";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onOptionSelect: (value: string, text: string) => void;
}

const sterAvatar = placeholderData.placeholderImages.find(
  (img) => img.id === "ster-avatar"
);

export const MessageList: FC<MessageListProps> = ({
  messages,
  isTyping,
  onOptionSelect,
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
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onOptionSelect={onOptionSelect}
          />
        ))}
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
