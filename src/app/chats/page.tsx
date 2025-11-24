import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderData from "@/lib/placeholder-images.json";
import { ChevronRight } from "lucide-react";

export default function ChatsPage() {
  const sterAvatar = placeholderData.placeholderImages.find(
    (img) => img.id === "ster-avatar"
  );

  return (
    <div className="h-screen bg-background text-foreground">
      <header className="bg-secondary text-foreground p-4 flex items-center shadow-md">
        <h1 className="text-xl font-bold">Conversas</h1>
      </header>
      <main className="p-2">
        <Link href="/chat/ster">
          <div className="flex items-center gap-4 p-3 hover:bg-secondary/80 rounded-lg cursor-pointer transition-colors">
            <Avatar className="h-14 w-14 border-2 border-primary/50">
              {sterAvatar && <AvatarImage src={sterAvatar.imageUrl} alt="Ster" />}
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Ster</h2>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Oi, eu sou Ster. Posso te fazer...
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </div>
        </Link>
      </main>
    </div>
  );
}
