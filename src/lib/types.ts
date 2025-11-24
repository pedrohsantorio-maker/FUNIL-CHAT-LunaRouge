export type MessageOption = {
  text: string;
  value: string;
};

export type Message = {
  id: string;
  sender: "user" | "bot";
  type: "text" | "audio" | "image" | "video" | "options" | "link";
  content: string;
  options?: MessageOption[];
  timestamp: Date;
  avatar?: string;
  name?: string;
};
