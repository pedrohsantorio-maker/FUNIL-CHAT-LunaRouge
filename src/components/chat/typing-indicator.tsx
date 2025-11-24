import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1 p-2", className)}>
      <span className="h-2 w-2 animate-[bounce_1s_infinite_0.1s] rounded-full bg-muted-foreground/80"></span>
      <span className="h-2 w-2 animate-[bounce_1s_infinite_0.2s] rounded-full bg-muted-foreground/80"></span>
      <span className="h-2 w-2 animate-[bounce_1s_infinite_0.3s] rounded-full bg-muted-foreground/80"></span>
    </div>
  );
}
