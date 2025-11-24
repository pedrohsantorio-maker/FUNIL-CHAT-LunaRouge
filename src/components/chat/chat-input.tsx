"use client";

import { useState, useRef, type FC, useEffect } from "react";
import { Paperclip, Mic, Send, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string, type: "text" | "audio") => void;
  isTyping: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isTyping }) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();


  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSendMessage(trimmedText, "text");
      setText("");
    }
  };

  const handleAudioSend = () => {
    setIsRecording(false);
    toast({
      title: "Recurso em desenvolvimento",
      description: "O envio de áudio ainda não foi implementado.",
    });
    // In a real app:
    // const audioFile = stopRecording();
    // onSendMessage(audioFileUrl, 'audio');
  };
  
  const handleAttach = () => {
     toast({
      title: "Recurso em desenvolvimento",
      description: "O anexo de mídias ainda não foi implementado.",
    });
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="p-4 bg-background border-t">
      <div className="relative flex items-end gap-2">
        {isRecording ? (
          <div className="w-full flex items-center gap-4 bg-secondary p-2 rounded-full">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
              <span className="font-mono text-sm tabular-nums">{formatTime(recordingTime)}</span>
            </div>
            <p className="flex-1 text-muted-foreground">Gravando áudio...</p>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setIsRecording(false)}>
              <X className="h-5 w-5"/>
            </Button>
             <Button size="icon" className="rounded-full" onClick={handleAudioSend}>
              <Check className="h-5 w-5"/>
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma mensagem..."
              className="flex-1 resize-none pr-24 max-h-32"
              disabled={isTyping}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={handleAttach}>
                <Paperclip className="h-5 w-5" />
              </Button>
              {text ? (
                <Button size="icon" className="rounded-full" onClick={handleSend} disabled={isTyping}>
                  <Send className="h-5 w-5" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setIsRecording(true)}>
                  <Mic className="h-5 w-5" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
