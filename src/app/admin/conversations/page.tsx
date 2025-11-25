"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConversationsPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Selecione uma Conversa</CardTitle>
                <CardDescription>
                    Para visualizar o histórico de uma conversa, selecione um lead na página de "Leads" ou na "Visão Geral".
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Você será redirecionado para a página de conversa do lead selecionado.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
