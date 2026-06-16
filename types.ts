export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface ClassicJoke {
  id: string;
  title: string;
  tag: string;
  characters: string[];
  dialogue: DialogueLine[];
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
