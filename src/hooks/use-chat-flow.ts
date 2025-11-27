"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import placeholderData from "@/lib/placeholder-images.json";
import {
  useAuth,
  useFirestore,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  useMemoFirebase,
} from "@/firebase";
import { doc, serverTimestamp, collection } from "firebase/firestore";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";

const sterAvatar = placeholderData.placeholderImages.find(
  (img) => img.id === "ster-avatar"
)?.imageUrl;

const initialMessage: Message = {
  id: "initial-1",
  sender: "bot",
  type: "options",
  content: "Oiie, querido, como você está? ❤",
  options: [
    {
      text: "Tudo ótimo gostosa, só pensando em você agora...",
      value: "positive_1",
    },
    {
      text: "Tô bem, mas agora que to falando com você, tudo ficou melhor!",
      value: "positive_2",
    },
  ],
  timestamp: new Date(),
  avatar: sterAvatar,
  name: "Luna Rouge",
};

const calculateTypingDelay = (text: string) => {
  const TYPING_SPEED = 50; // ms por caractere
  const BASE_DELAY = 500; // delay base
  return Math.min(BASE_DELAY + text.length * TYPING_SPEED, 5000);
};

const FINAL_LINK = "https://lunarouge-vip.netlify.app/";

export const useChatFlow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [lastStep, setLastStep] = useState(0); // To handle negative responses
  const [isConversionStep, setIsConversionStep] = useState(false);
  const [finalLink, setFinalLink] = useState("");
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [userId, setUserId] = useState<string | null>(null);

  // Memoize Firestore references
  const userDocRef = useMemoFirebase(
    () => (firestore && userId ? doc(firestore, "users", userId) : null),
    [firestore, userId]
  );
  const messagesColRef = useMemoFirebase(
    () =>
      firestore && userId
        ? collection(firestore, "users", userId, "chat_messages")
        : null,
    [firestore, userId]
  );

  const saveMessage = useCallback(
    (message: Message) => {
      if (!messagesColRef || !userId) return;
      const { id, ...messageData } = message;
      addDocumentNonBlocking(messagesColRef, {
        ...messageData,
        userId: userId, // Add userId to the message object
        // Convert Date to Firestore Timestamp for consistency
        timestamp: serverTimestamp(),
      });
    },
    [messagesColRef, userId]
  );

  const updateUser = useCallback(
    (data: Record<string, any>) => {
      if (!userDocRef) return;
      setDocumentNonBlocking(userDocRef, {
        ...data,
        lastInteractionAt: serverTimestamp(),
      }, { merge: true });
    },
    [userDocRef]
  );

  const handleConversion = useCallback(() => {
    updateUser({ hasConverted: true });
  }, [updateUser]);

  const addBotMessage = useCallback(
    async (message: Omit<Message, "sender" | "timestamp">, delay?: number) => {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, delay ?? 1000));
      const newMessage: Message = {
        ...message,
        sender: "bot",
        timestamp: new Date(),
        avatar: sterAvatar,
        name: "Luna Rouge",
      };
      setMessages((prev) => [...prev, newMessage]);
      saveMessage(newMessage); // Save bot message
      setIsTyping(false);
      return newMessage;
    },
    [saveMessage]
  );

  useEffect(() => {
    const initChat = async () => {
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
      } else {
        // Sign in anonymously and get UID
        initiateAnonymousSignIn(auth);
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUserId(user.uid);
            unsubscribe(); // Clean up listener
          }
        });
      }

      const firstMessage = { ...initialMessage, id: `bot-${Date.now()}` };
      setMessages([firstMessage]);
      // Don't save initial message to DB until user interacts
      setStep(1); // Set step to 1 to wait for user interaction
    };
    if (auth && firestore) {
      initChat();
    }
  }, [auth, firestore]);

  const handleOptionSelect = async (value: string, optionText: string) => {
    // Disable options on the message
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.options ? { ...msg, options: undefined } : msg
      )
    );

    // Add user's choice as a new message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      type: "text",
      content: optionText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    saveMessage(userMessage); // Save user message

    // Create user document on first interaction
    if (step === 1 && userDocRef) {
      setDocumentNonBlocking(userDocRef, {
        id: userId,
        createdAt: serverTimestamp(),
        lastInteractionAt: serverTimestamp(),
        currentStep: 1,
        hasConverted: false,
      }, { merge: true });
    }

    await handleBotResponse(value);
  };

  const handleBotResponse = async (userResponse: string) => {
    const nextStep = step + 1;
    updateUser({ currentStep: nextStep });

    switch (nextStep) {
      case 2:
        const msg2Content =
          "Vi que você me chamou, safado... quer ver o que tenho de mais quente só pra você? 😈 Tenho varias fotinhas e vídeos, tudo bem gostosinho, que vai te deixar louco de tesão…";
        await addBotMessage(
          {
            id: `bot-2-${Date.now()}`,
            type: "options",
            content: msg2Content,
            options: [
              {
                text: "Claro, me mostra tudo amor! Tô louco pra te ver🔥.",
                value: "show_all",
              },
              {
                text: "Hum, me conta mais antes de me mostrar...",
                value: "tell_more",
              },
            ],
          },
          calculateTypingDelay(msg2Content)
        );
        break;

      case 3:
        const msg3Content =
          "Meu amor, que sorte a sua em, me chamou justamente quando estou em um momento bem quente aqui... 😈 Você aceita um presentinho?";
        await addBotMessage(
          {
            id: `bot-3-${Date.now()}`,
            type: "options",
            content: msg3Content,
            options: [
              { text: "Sim, aceito o presentinho!", value: "yes_gift" },
              { text: "Não, obrigado.", value: "no_gift" },
            ],
          },
          calculateTypingDelay(msg3Content)
        );
        break;

      case 4:
        const positiveResponse = /yes_gift/.test(userResponse);
        if (positiveResponse) {
          await addBotMessage({
            id: `bot-video-4-${Date.now()}`,
            type: "video",
            content: "https://i.imgur.com/K4IJyip.mp4",
          });
          const msg4Content =
            "Essa é só uma prévia, amor... o melhor vem depois🙈.";
          await addBotMessage(
            {
              id: `bot-4-${Date.now()}`,
              type: "options",
              content: msg4Content,
              options: [
                {
                  text: "Porra, essa foi só uma prévia? Me manda mais gostosa😈",
                  value: "more_preview",
                },
                {
                  text: "Amei, mas quero ver tudo agora...",
                  value: "see_all_now",
                },
              ],
            },
            calculateTypingDelay(msg4Content)
          );
        } else {
          setLastStep(nextStep); // Save the current step
          const msg4ConfirmContent = "Tem certeza que não quer bebe😈?";
          await addBotMessage(
            {
              id: `bot-confirm-4-${Date.now()}`,
              type: "options",
              content: msg4ConfirmContent,
              options: [
                { text: "Sim, eu quero o presentinho!", value: "yes_gift" },
                { text: "Não, obrigado.", value: "no_gift" },
              ],
            },
            calculateTypingDelay(msg4ConfirmContent)
          );
          setStep(98); // Special step for handling negative confirmation (to avoid step increment)
          return; // Exit to prevent step increment
        }
        break;

      case 5:
        const msg5Content =
          "Gostou do que viu? Acabei de gravar, to molhadinha aqui pensando em você🙈";
        await addBotMessage(
          {
            id: `bot-5-${Date.now()}`,
            type: "options",
            content: msg5Content,
            options: [
              { text: "Amei delicía, me deixou duro aqui!", value: "loved_it" },
              {
                text: "Gostei demais, mas ainda quero ver o que mais tem por aí...",
                value: "want_more",
              },
            ],
          },
          calculateTypingDelay(msg5Content)
        );
        break;

      case 6:
        const msg6Content =
          "Eu sabia que você ia gostar safado, você é do tipo que adora um videozinho de uma novinha safada, né? Quer ver mais...? 😈";
        await addBotMessage(
          {
            id: `bot-6-${Date.now()}`,
            type: "options",
            content: msg6Content,
            options: [
              {
                text: "Eu adoro amor, me manda mais! Quero ver tudo de você.🔥",
                value: "love_it_2",
              },
              {
                text: "Você me deixou curioso, o que mais você tem ai gostosa?",
                value: "curious",
              },
            ],
          },
          calculateTypingDelay(msg6Content)
        );
        break;

      case 7:
        await addBotMessage(
          {
            id: `bot-image-7-${Date.now()}`,
            type: "image",
            content: "https://i.imgur.com/76kuQ9T.jpeg",
          },
          1500
        );
        const msg7Content =
          "Gostou dos meus peitos? Essa foi só para te deixar ainda mais duro seu gostoso... O que me diz, quer mais?🔥";
        await addBotMessage(
          {
            id: `bot-7-${Date.now()}`,
            type: "options",
            content: msg7Content,
            options: [
              { text: "Sim, quero mais, me mostra o resto!", value: "yes_more" },
              {
                text: "Isso tá demais, agora me conta o que vem a seguir...",
                value: "whats_next",
              },
            ],
          },
          calculateTypingDelay(msg7Content)
        );
        break;

      case 8:
        const msg8Content =
          "Gostou mesmo? Agora, me conta, você vai ficar me pedindo ou vai se entregar de vez? 👀";
        await addBotMessage(
          {
            id: `bot-8-${Date.now()}`,
            type: "options",
            content: msg8Content,
            options: [
              {
                text: "Vou me entregar, manda o que você tem de melhor!",
                value: "surrender",
              },
              {
                text: "Eu vou pedir até você ceder, quero mais de você!",
                value: "beg_for_it",
              },
            ],
          },
          calculateTypingDelay(msg8Content)
        );
        break;

      case 9:
        const msg9Content =
          "Conversar com você está me deixando ainda mais quente... 🥵 O que você quer agora?";
        await addBotMessage(
          {
            id: `bot-9-${Date.now()}`,
            type: "options",
            content: msg9Content,
            options: [
              {
                text: "Quero ver mais, me deixa ainda mais quente!",
                value: "see_more_hot",
              },
              { text: "Agora, só quero te ter... vem aqui!", value: "want_you_now" },
            ],
          },
          calculateTypingDelay(msg9Content)
        );
        break;

      case 10:
        const msg10Content =
          "Entre nós, bebê… tô adorando conversar com você, já tô doida pra você me ver bem peladinha, gozando bem gostoso só pra você 😈";
        await addBotMessage(
          {
            id: `bot-text-10-${Date.now()}`,
            type: "text",
            content: msg10Content,
          },
          calculateTypingDelay(msg10Content)
        );
        await addBotMessage(
          {
            id: `bot-audio-11-${Date.now()}`,
            type: "audio",
            content: "https://jocular-pithivier-c69b56.netlify.app/[Isabela%20]Nossa......c%C3%AA....mp3",
          },
          1500
        );
        const msg12Content =
          "E aí, amor o que você me diz? Tá preparado pra me ter inteirinha pra você? 🔥❤";
        await addBotMessage(
          {
            id: `bot-options-12-${Date.now()}`,
            type: "options",
            content: msg12Content,
            options: [
              {
                text: "Sim, topo tudo, quero você inteirinha! 😈",
                value: "yes_all_in",
              },
              {
                text: "Claro, tô pronto pra te ter do jeito que você quiser!",
                value: "yes_ready",
              },
            ],
          },
          calculateTypingDelay(msg12Content)
        );
        break;

      case 11:
      case 12:
      case 13:
         await addBotMessage(
          {
            id: `bot-link-13-${Date.now()}`,
            type: "link",
            content: FINAL_LINK,
            linkTitle: "Luna Exclusivos",
          },
          1500
        );
        const msg13Content =
          "Não posso mandar mais fotinhas aqui, mas nesse site tem mais conteúdo gratuito bem sexy só para você, da uma olhada la gostoso, você não vai se arrepender!😘";
        await addBotMessage(
          {
            id: `bot-text-13-${Date.now()}`,
            type: "text",
            content: msg13Content,
          },
          calculateTypingDelay(msg13Content)
        );
        setIsConversionStep(true);
        setFinalLink(FINAL_LINK);
        break;

      case 99: // Handles "Tem certeza?"
        if (userResponse === "yes_gift") {
          setStep(lastStep -1); // Go back to the step before confirmation
          handleBotResponse("yes_gift"); // Re-trigger with a positive response
          return; // Exit to prevent step increment
        } else {
          const msg99Content = "Que pena, amor. Se mudar de ideia, é só me chamar. 😉";
          await addBotMessage(
            {
              id: `bot-wait-99-${Date.now()}`,
              type: "text",
              content: msg99Content,
            },
            calculateTypingDelay(msg99Content)
          );
          setStep(lastStep); // Go back to the step before the confirmation
          updateUser({ currentStep: lastStep });
          return; // Exit to prevent step increment
        }
    }
    setStep(nextStep);
  };

  return { messages, isTyping, handleOptionSelect, handleConversion, isConversionStep, finalLink };
};
