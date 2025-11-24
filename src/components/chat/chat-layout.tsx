"use client";

import { useChatFlow } from "@/hooks/use-chat-flow";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

export function ChatLayout() {
  const { messages, isTyping, addUserMessage, handleOptionSelect } = useChatFlow();

  return (
    <div className="flex flex-col h-full bg-secondary/40">
      <ChatHeader />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onOptionSelect={handleOptionSelect}
      />
      <ChatInput onSendMessage={addUserMessage} isTyping={isTyping} />
    </div>
  );
}
