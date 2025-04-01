
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sender_details?: {
    full_name?: string;
  } | undefined;
}

// Define a utility function to map from Supabase chat message to our Message type
export const mapChatMessageToMessage = (chatMessage: any): Message => {
  return {
    id: chatMessage.id,
    content: chatMessage.content,
    sender: chatMessage.is_assistant ? 'assistant' : 'user',
    timestamp: new Date(chatMessage.created_at),
    sender_details: chatMessage.profiles || undefined
  };
};
