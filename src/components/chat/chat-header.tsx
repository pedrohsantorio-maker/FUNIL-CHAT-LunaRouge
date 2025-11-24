import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import placeholderData from "@/lib/placeholder-images.json";

export function ChatHeader() {
  const sterAvatar = placeholderData.placeholderImages.find(
    (img) => img.id === "ster-avatar"
  );
  return (
    <header className="flex items-center p-3 border-b bg-secondary shadow-sm">
       <Link href="/chats" className="md:hidden mr-2">
         <Button variant="ghost" size="icon">
           <ArrowLeft/>
         </Button>
      </Link>
      <Avatar className="h-10 w-10 border-2 border-primary">
        {sterAvatar && <AvatarImage src={sterAvatar.imageUrl} alt="Ster" />}
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1">
        <p className="text-sm">
            <span className="font-light text-white">Eternal</span>{' '}
            <span className="font-bold text-primary">Love</span>
        </p>
        <p className="text-xs text-muted-foreground">online</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
