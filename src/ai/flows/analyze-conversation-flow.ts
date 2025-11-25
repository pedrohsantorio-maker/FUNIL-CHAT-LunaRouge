"use server";

import { ai } from "@/ai/genkit";
import { z } from "zod";

export const AnalyzeConversationInputSchema = z.object({
  chatHistory: z.string().describe("O histórico de chat completo entre o bot e o usuário."),
});
export type AnalyzeConversationInput = z.infer<
  typeof AnalyzeConversationInputSchema
>;

export const AnalyzeConversationOutputSchema = z.object({
  summary: z.string().describe("Um resumo conciso da conversa."),
  sentiment: z
    .enum(["Positivo", "Negativo", "Neutro", "Misto"])
    .describe("O sentimento geral do usuário durante a conversa."),
  suggestions: z
    .array(z.string())
    .describe(
      "Sugestões acionáveis para otimizar o fluxo do chatbot com base nesta conversa específica."
    ),
});
export type AnalyzeConversationOutput = z.infer<
  typeof AnalyzeConversationOutputSchema
>;

const analysisPrompt = ai.definePrompt({
  name: "analyzeConversationPrompt",
  input: { schema: AnalyzeConversationInputSchema },
  output: { schema: AnalyzeConversationOutputSchema },
  prompt: `
    Você é um especialista em análise de conversas de chatbot. Sua tarefa é analisar o histórico de chat fornecido e extrair insights.

    Histórico da Conversa:
    ---
    {{{chatHistory}}}
    ---

    Com base no histórico, forneça o seguinte:
    1.  **Resumo:** Um resumo conciso do que foi discutido.
    2.  **Sentimento:** O sentimento geral do usuário (Positivo, Negativo, Neutro, Misto).
    3.  **Sugestões:** Pelo menos 2 sugestões práticas para melhorar o fluxo do chatbot e aumentar o engajamento ou a conversão, com base nos pontos onde o usuário hesitou ou em suas respostas.
    `,
});

const analyzeConversationFlow = ai.defineFlow(
  {
    name: "analyzeConversationFlow",
    inputSchema: AnalyzeConversationInputSchema,
    outputSchema: AnalyzeConversationOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);

export async function analyzeConversation(
  input: AnalyzeConversationInput
): Promise<AnalyzeConversationOutput> {
  return analyzeConversationFlow(input);
}
