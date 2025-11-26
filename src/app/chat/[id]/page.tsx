"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function ChatPage() {
  return (
    <FirebaseClientProvider>
      <main className="h-screen">
        <ChatLayout />
      </main>
    </FirebaseClientProvider>
  );
}