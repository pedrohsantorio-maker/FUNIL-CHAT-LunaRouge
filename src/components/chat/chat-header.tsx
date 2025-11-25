import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import placeholderData from "@/lib/placeholder-images.json";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

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
      <Dialog>
        <DialogTrigger asChild>
          <Avatar className="h-10 w-10 border-2 border-primary cursor-pointer">
            {sterAvatar && <AvatarImage src={sterAvatar.imageUrl} alt="Luna Rouge" />}
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="p-0 border-0 max-w-fit bg-transparent">
          <DialogTitle className="sr-only">Imagem de perfil de Luna Rouge</DialogTitle>
          <DialogDescription className="sr-only">
            Uma imagem ampliada do avatar de Luna Rouge.
          </DialogDescription>
          {sterAvatar && (
            <Image
              src={sterAvatar.imageUrl}
              alt="Luna Rouge"
              width={800}
              height={800}
              className="rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="ml-3 flex-1">
        <p className="text-sm font-bold text-primary">
          Luna Rouge
        </p>
        <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs text-muted-foreground">online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Video and Phone buttons removed as per request */}
      </div>
    </header>
  );
}
