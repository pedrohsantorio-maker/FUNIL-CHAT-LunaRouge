"use client";

import { useChatFlow } from "@/hooks/use-chat-flow";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useMemo } from "react";

export function ChatLayout() {
  const { messages, isTyping, handleOptionSelect, handleConversion } = useChatFlow();

  const memoizedChatFlow = useMemo(() => ({
    messages,
    isTyping,
    handleOptionSelect,
    handleConversion,
  }), [messages, isTyping, handleOptionSelect, handleConversion]);

  return (
    <div className="flex flex-col h-full bg-secondary/40">
      <ChatHeader />
      <MessageList
        messages={memoizedChatFlow.messages}
        isTyping={memoizedChatFlow.isTyping}
        onOptionSelect={(value, text) => memoizedChatFlow.handleOptionSelect(value, text)}
      />
      <ChatInput isTyping={isTyping} />
    </div>
  );
}
