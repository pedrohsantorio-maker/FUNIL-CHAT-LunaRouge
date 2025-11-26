import { z } from "zod";

export const AnalyzeConversationInputSchema = z.object({
  chatHistory: z
    .string()
    .describe("O histórico de chat completo entre o bot e o usuário."),
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
