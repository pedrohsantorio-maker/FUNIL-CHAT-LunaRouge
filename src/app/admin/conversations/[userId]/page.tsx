"use client";

import { useParams } from "next/navigation";
import {
  useFirestore,
  useDoc,
  useCollection,
} from "@/firebase";
import { doc, collection, orderBy, query } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useState } from "react";
import { analyzeConversation } from "@/ai/flows/analyze-conversation-flow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function ConversationPage() {
  const { userId } = useParams<{ userId: string }>();
  const firestore = useFirestore();

  const userRef = doc(firestore, "users", userId);
  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);

  const messagesRef = collection(firestore, "users", userId, "chat_messages");
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
  const { data: messages, isLoading: areMessagesLoading } =
    useCollection(messagesQuery);

  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    sentiment: string;
    suggestions: string[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!messages || messages.length === 0) return;
    setIsAnalysisLoading(true);
    setIsModalOpen(true);
    try {
      const chatHistory = messages
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");
      const result = await analyzeConversation({ chatHistory });
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing conversation:", error);
      setAnalysisResult({
        summary: "Erro ao analisar a conversa.",
        sentiment: "Desconhecido",
        suggestions: [],
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const renderMessageContent = (message: any) => {
    switch (message.type) {
      case "image":
        return <img src={message.content} alt="Imagem do chat" className="rounded-lg max-w-xs" />;
      case "video":
        return <video src={message.content} controls className="rounded-lg max-w-xs" />;
      case "audio":
        return <audio src={message.content} controls />;
      case "link":
        return (
          <a href={message.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {message.linkTitle || message.content}
          </a>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Conversa com o Lead</CardTitle>
            {isUserLoading ? (
              <Skeleton className="h-5 w-48 mt-1" />
            ) : (
              <CardDescription>
                {userData?.email || `ID: ${userId}`}
              </CardDescription>
            )}
          </div>
          <Button onClick={handleAnalyze} disabled={areMessagesLoading || isAnalysisLoading}>
            Analisar Conversa com IA
          </Button>
        </CardHeader>
      </Card>
      <div className="flex-1 bg-muted/30 rounded-lg p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {areMessagesLoading && (
            Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className={cn("h-16 w-3/4 rounded-lg", i % 2 === 0 ? "self-start" : "self-end")} />
            ))
          )}
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === "bot" ? "justify-start" : "justify-end"
              )}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-prose rounded-lg px-4 py-2",
                  message.sender === "bot"
                    ? "bg-background text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {renderMessageContent(message)}
              </div>
              {message.sender === "user" && (
                 <Avatar className="h-8 w-8">
                   <AvatarFallback>
                     <User />
                   </AvatarFallback>
                 </Avatar>
              )}
            </div>
          ))}
          {!areMessagesLoading && messages?.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhuma mensagem nesta conversa ainda.
            </p>
          )}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Análise da Conversa</DialogTitle>
            <DialogDescription>
              Resumo, sentimento e sugestões gerados por IA.
            </DialogDescription>
          </DialogHeader>
          {isAnalysisLoading ? (
             <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-1/4" />
                 <Skeleton className="h-24 w-full" />
             </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-6">
                <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold mb-2">Resumo da Conversa</h3>
                    <p className="text-muted-foreground">{analysisResult?.summary}</p>
                </section>
                 <section>
                    <h3 className="text-lg font-semibold mb-2">Sentimento do Usuário</h3>
                    <Badge>{analysisResult?.sentiment}</Badge>
                </section>
                <section>
                    <h3 className="text-lg font-semibold mb-2">Sugestões de Otimização</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {analysisResult?.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                    </ul>
                </section>
                </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
