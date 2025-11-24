"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import placeholderData from "@/lib/placeholder-images.json";

const sterAvatar = placeholderData.placeholderImages.find(
  (img) => img.id === "ster-avatar"
)?.imageUrl;

const initialMessage: Message = {
  id: "initial-1",
  sender: "bot",
  type: "text",
  content: "Oi, eu sou a Luna Rouge. ✨",
  timestamp: new Date(),
  avatar: sterAvatar,
  name: "Luna Rouge",
};

const secondMessage: Message = {
  id: "initial-2",
  sender: "bot",
  type: "text",
  content: "Posso te fazer 2 perguntinhas rápidas?",
  timestamp: new Date(Date.now() + 1000),
  avatar: sterAvatar,
  name: "Luna Rouge",
};

export const useChatFlow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const { toast } = useToast();

  const addBotMessage = useCallback(
    async (message: Omit<Message, "sender" | "timestamp">) => {
      setIsTyping(true);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000)
      );
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          sender: "bot",
          timestamp: new Date(),
          avatar: sterAvatar,
          name: "Luna Rouge",
        },
      ]);
      setIsTyping(false);
    },
    []
  );

  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessages([initialMessage]);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessages((prev) => [...prev, secondMessage]);
      setIsTyping(false);
      setStep(1);
    };
    initChat();
  }, []);

  const addUserMessage = async (content: string, type: Message["type"] = "text") => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    await handleBotResponse(content);
  };

  const handleOptionSelect = async (value: string, optionText: string) => {
     // Find the message with options and remove the options
    const messageWithOptionsIndex = messages.findIndex(
      (msg) => msg.options && msg.options.length > 0
    );

    if (messageWithOptionsIndex > -1) {
      const updatedMessages = [...messages];
      updatedMessages[messageWithOptionsIndex] = {
        ...updatedMessages[messageWithOptionsIndex],
        options: undefined,
      };

      setMessages([
        ...updatedMessages,
        {
          id: `user-${Date.now()}`,
          sender: "user",
          type: "text",
          content: optionText,
          timestamp: new Date(),
        },
      ]);
    } else {
       // Fallback for when there are no options to remove, e.g. after a "no" response.
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: "user",
          type: "text",
          content: optionText,
          timestamp: new Date(),
        },
      ]);
    }

    await handleBotResponse(value);
  };

  const handleBotResponse = async (userResponse: string) => {
    switch (step) {
      case 1: // After welcome, ask for name
        await addBotMessage({ id: `bot-${Date.now()}`, type: "text", content: "Primeiro, qual o seu nome?" });
        setStep(2);
        break;
      case 2: // After name, ask for email
        setUserData({ ...userData, name: userResponse });
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "text",
          content: `Legal, ${userResponse}! 😊 E qual o seu melhor e-mail?`,
        });
        setStep(3);
        break;
      case 3: // After email, validate and ask for confirmation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userResponse)) {
          await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "text",
            content:
              "Hmm, esse e-mail não parece válido. 🤔 Poderia tentar de novo?",
          });
        } else {
          setUserData({ ...userData, email: userResponse });
          await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "text",
            content: `Perfeito! Anotado. Para continuar, preciso que você confirme que está pronto para ir para a próxima etapa.`,
          });
          await addBotMessage({
            id: `bot-options-${Date.now()}`,
            type: "options",
            content: "Podemos prosseguir?",
            options: [
              { text: "Estou pronto 👍", value: "yes" },
              { text: "Agora não", value: "no" },
            ],
          });
          setStep(4);
        }
        break;
      case 4: // After confirmation, send link or wait
        if (userResponse === "yes") {
          await addBotMessage({
            id: `bot-generating-${Date.now()}`,
            type: "text",
            content: "Ótimo! Estou gerando seu acesso exclusivo...",
          });
          // Simulate API call
          await new Promise(res => setTimeout(res, 1500));
          await addBotMessage({
            id: `bot-link-${Date.now()}`,
            type: "link",
            content: "https://checkout.example.com/offer",
          });
          await addBotMessage({
            id: `bot-followup-${Date.now()}`,
            type: "text",
            content: "Clique no link acima para continuar. Estou te esperando! 😉",
          });
          setStep(5);
        } else {
          await addBotMessage({
            id: `bot-wait-${Date.now()}`,
            type: "text",
            content: "Tudo bem. Me avise quando estiver pronto! estarei aqui.",
          });
          await addBotMessage({
            id: `bot-options-${Date.now()}`,
            type: "options",
            content: "Pronto para continuar?",
            options: [
              { text: "Estou pronto 👍", value: "yes" },
            ],
          });
        }
        break;
      default:
        // Conversation ended or in an unknown state
        break;
    }
  };

  return { messages, isTyping, addUserMessage, handleOptionSelect };
};
