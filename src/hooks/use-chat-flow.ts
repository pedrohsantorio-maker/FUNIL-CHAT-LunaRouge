"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import placeholderData from "@/lib/placeholder-images.json";

const sterAvatar = placeholderData.placeholderImages.find(
  (img) => img.id === "ster-avatar"
)?.imageUrl;
const botImage = placeholderData.placeholderImages.find(
  (img) => img.id === "bot-image-message"
)?.imageUrl;

const initialMessage: Message = {
  id: "initial-1",
  sender: "bot",
  type: "text",
  content: "Oiie, querido, como você está? ❤",
  timestamp: new Date(),
  avatar: sterAvatar,
  name: "Luna Rouge",
};

export const useChatFlow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [lastStep, setLastStep] = useState(0); // To handle negative responses
  const { toast } = useToast();

  const addBotMessage = useCallback(
    async (message: Omit<Message, "sender" | "timestamp">, delay?: number) => {
      setIsTyping(true);
      await new Promise((resolve) =>
        setTimeout(resolve, delay ?? 1000 + Math.random() * 1000)
      );
      const newMessage: Message = {
        ...message,
        sender: "bot",
        timestamp: new Date(),
        avatar: sterAvatar,
        name: "Luna Rouge",
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
      return newMessage;
    },
    []
  );

  useEffect(() => {
    const initChat = async () => {
      await addBotMessage({ ...initialMessage, id: `bot-${Date.now()}` }, 500);
      setStep(1);
    };
    initChat();
  }, [addBotMessage]);

  const addUserMessage = async (content: string, type: Message["type"] = "text") => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    await handleBotResponse(content.toLowerCase());
  };

  const handleOptionSelect = async (value: string, optionText: string) => {
    // Find the message with options and remove them to prevent re-selection
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.options ? { ...msg, options: undefined } : msg
      );
      // Add the user's choice as a new message
      return [
        ...updatedMessages,
        {
          id: `user-${Date.now()}`,
          sender: "user",
          type: "text",
          content: optionText,
          timestamp: new Date(),
        },
      ];
    });

    await handleBotResponse(value);
  };

  const handleBotResponse = async (userResponse: string) => {
    switch (step) {
      case 1:
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "options",
          content: "Vi que você me chamou, safado... quer ver o que tenho de mais quente só pra você? 😈 Tenho varias fotinhas e vídeos, tudo bem gostosinho, que vai te deixar louco de tesão…",
          options: [
            { text: "Claro, me mostra tudo amor! Tô louco pra te ver🔥.", value: "show_all" },
            { text: "Hum, me conta mais antes de me mostrar...", value: "tell_more" },
          ],
        });
        setStep(2);
        break;

      case 2:
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "text",
          content: "Meu amor, que sorte a sua em, me chamou justamente quando estou em um momento bem quente aqui... 😈 Você aceita um presentinho?",
        });
        setStep(3);
        break;

      case 3:
        const positiveResponse = /sim|claro|com certeza|aceito|quero|manda/.test(userResponse);
        if (positiveResponse) {
          await addBotMessage({
            id: `bot-video-${Date.now()}`,
            type: "video",
            content: "https://i.imgur.com/8Q9Z5C1.mp4",
          });
          await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "options",
            content: "Essa é só uma prévia, amor... o melhor vem depois🙈.",
            options: [
                { text: "Porra, essa foi só uma prévia? Me manda mais gostosa😈", value: "more_preview" },
                { text: "Amei, mas quero ver tudo agora...", value: "see_all_now" },
            ]
          });
          setStep(4);
        } else {
          setLastStep(3); // Save the current step
          await addBotMessage({
            id: `bot-confirm-${Date.now()}`,
            type: "options",
            content: "Tem certeza que não quer bebe😈?",
             options: [
                { text: "Sim, eu quero o presentinho!", value: "yes_gift" },
                { text: "Não, obrigado.", value: "no_gift" },
            ]
          });
          setStep(99); // Special step for handling negative confirmation
        }
        break;
        
      case 4:
         await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "options",
          content: "Gostou do que viu? Acabei de gravar, to molhadinha aqui pensando em você🙈",
           options: [
                { text: "Amei delicía, me deixou duro aqui!", value: "loved_it" },
                { text: "Gostei demais, mas ainda quero ver o que mais tem por aí...", value: "want_more" },
            ]
        });
        setStep(5);
        break;

      case 5:
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "options",
          content: "Eu sabia que você ia gostar safado, você é do tipo que adora um videozinho de uma novinha safada, né? Quer ver mais...? 😈",
          options: [
            { text: "Eu adoro amor, me manda mais! Quero ver tudo de você.🔥", value: "love_it" },
            { text: "Você me deixou curioso, o que mais você tem ai gostosa?", value: "curious" },
          ]
        });
        setStep(6);
        break;

      case 6:
        await addBotMessage({
          id: `bot-image-${Date.now()}`,
          type: "image",
          content: botImage || "",
        });
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "options",
          content: "Gostou dos meus peitos? Essa foi só para te deixar ainda mais duro seu gostoso... O que me diz, quer mais?🔥",
          options: [
            { text: "Sim, quero mais, me mostra o resto!", value: "yes_more" },
            { text: "Isso tá demais, agora me conta o que vem a seguir...", value: "whats_next" },
          ]
        });
        setStep(7);
        break;

      case 7:
        await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "options",
            content: "Gostou mesmo? Agora, me conta, você vai ficar me pedindo ou vai se entregar de vez? 👀",
            options: [
                { text: "Vou me entregar, manda o que você tem de melhor!", value: "surrender" },
                { text: "Eu vou pedir até você ceder, quero mais de você!", value: "beg_for_it" },
            ]
        });
        setStep(8);
        break;

      case 8:
         await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "options",
            content: "Conversar com você está me deixando ainda mais quente... 🥵 O que você quer agora?",
            options: [
                { text: "Quero ver mais, me deixa ainda mais quente!", value: "see_more_hot" },
                { text: "Agora, só quero te ter... vem aqui!", value: "want_you_now" },
            ]
        });
        setStep(9);
        break;

      case 9:
        await addBotMessage({
            id: `bot-${Date.now()}`,
            type: "text",
            content: "Entre nós, bebê… tô adorando conversar com você, já tô doida pra você me ver bem peladinha, gozando bem gostoso só pra você 😈",
        });
        setStep(10);
        await handleBotResponse(userResponse); // chain to next step
        break;
      
      case 10:
        await addBotMessage({
            id: `bot-audio-${Date.now()}`,
            type: "audio",
            content: "https://firebasestorage.googleapis.com/v0/b/chatbot-challenge-d5a23.appspot.com/o/audio.mp3?alt=media&token=38528f57-1a01-4475-ae90-256561115b3c", // Placeholder
        });
        setStep(11);
        await handleBotResponse(userResponse); // chain to next step
        break;

      case 11:
        await addBotMessage({
            id: `bot-options-${Date.now()}`,
            type: "options",
            content: "E aí, amor o que você me diz? Tá preparado pra me ter inteirinha pra você? 🔥❤",
            options: [
                { text: "Sim, topo tudo, quero você inteirinha! 😈", value: "yes_all_in" },
                { text: "Claro, tô pronto pra te ter do jeito que você quiser!", value: "yes_ready" },
            ],
        });
        setStep(12);
        break;

      case 12:
        await addBotMessage({
            id: `bot-link-${Date.now()}`,
            type: "link",
            content: "https://checkout.example.com/offer", // your actual link
        });
        await addBotMessage({
          id: `bot-${Date.now()}`,
          type: "text",
          content: "Não posso mandar mais fotinhas aqui, mas nesse site tem mais conteúdo gratuito bem sexy só para você, da uma olhada la gostoso, você não vai se arrepender!😘",
        });
        setStep(13);
        break;

      case 13:
         await addBotMessage({
            id: `bot-final-${Date.now()}`,
            type: "text",
            content: "Estou esperando por você, vem ver o que tenho preparado para você... Não vai se arrepender, prometo. DICA: se o gratuito é assim, imagina as fotos e vídeos exclusivos para meus queridos assinantes 😏",
        });
        setStep(14); // End of main flow
        break;

      case 14: // After flow ends
        await addBotMessage({
            id: `bot-redirect-${Date.now()}`,
            type: "text",
            content: "Todo o conteúdo mais quente está te esperando no site, meu amor. Clica no link que te mandei pra gente continuar essa conversa por lá. 🔥",
        });
        break;

      case 99: // Handles "Tem certeza?"
        if (userResponse === 'yes_gift') {
            setStep(3);
            await handleBotResponse('sim'); // Re-trigger step 3 with a positive response
        } else {
            await addBotMessage({
                id: `bot-wait-${Date.now()}`,
                type: "text",
                content: "Que pena, amor. Se mudar de ideia, é só me chamar. 😉",
            });
            setStep(lastStep); // Go back to the step before the confirmation
        }
        break;
        
      default:
        // Conversation ended or in an unknown state.
        // Redirect to link if they keep talking.
        if (step >= 14) {
           await addBotMessage({
            id: `bot-redirect-loop-${Date.now()}`,
            type: "text",
            content: "Você é insistente, gostei disso... 😉 Mas o que você quer ver mesmo tá lá no site. Clica no link pra não perder tempo!",
          });
        }
        break;
    }
  };

  return { messages, isTyping, addUserMessage, handleOptionSelect };
};
