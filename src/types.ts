export interface WidgetsProps {
  quotes: boolean;
  reminders: boolean;
  funFacts: boolean;
}

export type Mood = 'happy' | 'calm' | 'sad';
export type Tab = 'settings' | 'games' | 'chat';
export type Message = { text: string; isBot: boolean };
