
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sender_details?: {
    full_name?: string;
  };
}
