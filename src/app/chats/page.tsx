"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import placeholderData from "@/lib/placeholder-images.json";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const router = useRouter();
  const sterAvatar = placeholderData.placeholderImages.find(
    (img) => img.id === "ster-avatar"
  );

  const handleChatClick = () => {
    router.push("/chat/ster");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6 sm:p-8 font-sans">
      <header>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-[#121212] rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-lg">
          <Avatar className="h-24 w-24 border-4 border-primary">
            {sterAvatar && <AvatarImage src={sterAvatar.imageUrl} alt="Luna Rouge" />}
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-2xl font-bold text-white animate-[pulse_2s_infinite] [text-shadow:0_0_10px_hsl(var(--primary))]">
            Luna Rouge
          </h2>
          <p className="mt-2 text-slate-400 flex items-center">
            Oi, gostoso... como tá o tesão aí? <Heart className="h-4 w-4 ml-1.5 fill-primary text-primary" />
          </p>
          <Button
            onClick={handleChatClick}
            className="mt-6 w-full bg-primary text-primary-foreground font-bold text-base py-6 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,153,0,0.5)] hover:shadow-[0_0_30px_rgba(255,153,0,0.7)] animate-[pulse_2s_infinite]"
          >
            Conversar com Luna Rouge
          </Button>
        </div>
      </main>
    </div>
  );
}
