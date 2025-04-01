import React, { useState, useEffect } from 'react';
import GOVUKLayout from '../components/GOVUKLayout';
import { Send, Info, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getFamilyForUser, getChatMessages, addChatMessage, subscribeToChatMessages } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Message, mapChatMessageToMessage } from '@/types/message';

const Help = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [family, setFamily] = useState<{family_id: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          // Load family data
          const familyData = await getFamilyForUser(user.id);
          setFamily(familyData as {family_id: string} | null);
          
          if (familyData && 'family_id' in familyData) {
            // Load chat messages
            const chatMessages = await getChatMessages(familyData.family_id);
            
            const formattedMessages = chatMessages.map((msg: any) => mapChatMessageToMessage(msg));
            
            setMessages(formattedMessages);
            
            // Subscribe to new messages
            const subscription = subscribeToChatMessages(familyData.family_id, (payload) => {
              const newMsg = payload.new;
              
              const formattedMsg = mapChatMessageToMessage(newMsg);
              
              setMessages(prev => [...prev, formattedMsg]);
            });
            
            return () => {
              subscription.unsubscribe();
            };
          } else {
            // Set default welcome message if no family
            setMessages([
              {
                id: '1',
                content: "Hello, I'm here to help you with questions about separation and your parenting arrangements. What can I help you with today?",
                sender: 'assistant',
                timestamp: new Date()
              }
            ]);
          }
        } catch (error: any) {
          console.error('Error loading data:', error);
          toast({
            title: "Error loading messages",
            description: error.message,
            variant: "destructive",
          });
          
          // Set default welcome message on error
          setMessages([
            {
              id: '1',
              content: "Hello, I'm here to help you with questions about separation and your parenting arrangements. What can I help you with today?",
              sender: 'assistant',
              timestamp: new Date()
            }
          ]);
        }
      } else {
        // Set default welcome message for non-authenticated users
        setMessages([
          {
            id: '1',
            content: "Hello, I'm here to help you with questions about separation and your parenting arrangements. What can I help you with today?",
            sender: 'assistant',
            timestamp: new Date()
          }
        ]);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [user, toast]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Check for inappropriate content (simplified example)
    const lowercaseInput = inputValue.toLowerCase();
    const blockedWords = ['abuse', 'hurt', 'attack', 'kill'];
    
    if (blockedWords.some(word => lowercaseInput.includes(word))) {
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 5000);
      return;
    }
    
    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const message = inputValue;
    setInputValue('');
    
    if (user && family) {
      try {
        // Save message to database
        await addChatMessage({
          family_id: family.family_id,
          sender_id: user.id,
          is_assistant: false,
          content: message
        });
        
        // Simulate assistant response
        setTimeout(async () => {
          let responseContent = '';
          
          if (lowercaseInput.includes('holiday') || lowercaseInput.includes('vacation')) {
            responseContent = "I can see from your parenting plan that you have 3 upcoming holiday arrangements. Would you like me to help you with planning another holiday or understanding the current arrangements?";
          } else if (lowercaseInput.includes('mediation') || lowercaseInput.includes('mediator')) {
            responseContent = "Mediation can help you and your ex-partner agree on arrangements for your children. A mediator is an independent, trained professional who helps you reach agreements without going to court. You can find local mediators through the Family Mediation Council: https://www.familymediationcouncil.org.uk/";
          } else if (lowercaseInput.includes('money') || lowercaseInput.includes('financial') || lowercaseInput.includes('finance')) {
            responseContent = "Based on your financial arrangements, you currently have 3 agreed items and 3 items where you and your ex-partner have different views. Would you like information about child maintenance calculations or help with discussing the disagreed items?";
          } else if (lowercaseInput.includes('court') || lowercaseInput.includes('legal')) {
            responseContent = "Going to court should usually be a last resort. Before applying to court, you'll need to attend a Mediation Information and Assessment Meeting (MIAM), unless exemptions apply such as in cases involving domestic abuse. Would you like information about the court process or alternatives to court?";
          } else {
            responseContent = "Thank you for your question. I can provide information about parenting arrangements, financial matters, and support services. Would you like to know more about any specific area of separation or co-parenting?";
          }
          
          // Save assistant response to database
          await addChatMessage({
            family_id: family.family_id,
            sender_id: null,
            is_assistant: true,
            content: responseContent
          });
        }, 1000);
      } catch (error: any) {
        console.error('Error saving message:', error);
        toast({
          title: "Error sending message",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Simulate assistant response for non-authenticated users
      setTimeout(() => {
        let responseContent = '';
        
        if (lowercaseInput.includes('holiday') || lowercaseInput.includes('vacation')) {
          responseContent = "I can help you understand how to plan holiday arrangements with your co-parent. Would you like to sign up to create and manage your own holiday schedule?";
        } else if (lowercaseInput.includes('mediation') || lowercaseInput.includes('mediator')) {
          responseContent = "Mediation can help you and your ex-partner agree on arrangements for your children. A mediator is an independent, trained professional who helps you reach agreements without going to court. You can find local mediators through the Family Mediation Council: https://www.familymediationcouncil.org.uk/";
        } else if (lowercaseInput.includes('money') || lowercaseInput.includes('financial') || lowercaseInput.includes('finance')) {
          responseContent = "I can provide general information about financial arrangements after separation. For personalized advice, consider creating an account to use our financial arrangements comparison tool.";
        } else {
          responseContent = "Thank you for your question. I can provide general information about separation and co-parenting. For personalized assistance, consider creating an account.";
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <GOVUKLayout>
      <div className="grid gap-8">
        <div>
          <h1>Get help and support</h1>
          <p className="text-xl mb-6">
            Find answers to your questions and access support services.
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="border border-gray-300 bg-white rounded-lg flex flex-col h-[600px]">
              <div className="bg-govuk-blue text-white p-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-bold">Support assistant</h2>
              </div>
              
              <div className="flex-grow p-4 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-govuk-blue"></div>
                  </div>
                ) : (
                  <>
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`mb-4 max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                      >
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-govuk-light-blue text-govuk-blue' 
                            : 'bg-gray-100'
                        }`}>
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span>
                            {message.sender === 'user' && message.sender_details 
                              ? message.sender_details.full_name 
                              : message.sender === 'assistant' 
                                ? 'Assistant' 
                                : 'You'}
                          </span>
                          <span className="mx-1">•</span>
                          <span>
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {isBlocked && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-bold">Unable to respond</p>
                            <p className="text-sm">Your message contains content that appears to discuss harm or abuse. If you're concerned about your safety or someone else's, please contact appropriate support services:</p>
                            <ul className="list-disc pl-6 mt-2 text-sm">
                              <li>National Domestic Abuse Helpline: 0808 2000 247</li>
                              <li>In an emergency, call 999</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-300">
                <div className="flex">
                  <textarea
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-govuk-blue"
                    placeholder="Type your question here..."
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isBlocked || isLoading}
                  />
                  <button 
                    className="bg-govuk-blue text-white p-2 rounded-r-md"
                    onClick={handleSendMessage}
                    disabled={isBlocked || !inputValue.trim() || isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This assistant can answer general questions. For personal advice, please contact a professional.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white border border-gray-300 p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">Support services</h2>
              <ul className="space-y-4">
                <li>
                  <h3 className="font-bold">Child Maintenance Service</h3>
                  <p className="text-sm mb-1">Help with child maintenance arrangements</p>
                  <a href="#" className="text-govuk-blue hover:underline text-sm">
                    Visit website
                  </a>
                </li>
                <li>
                  <h3 className="font-bold">Family Mediation Council</h3>
                  <p className="text-sm mb-1">Find qualified mediators near you</p>
                  <a href="#" className="text-govuk-blue hover:underline text-sm">
                    Visit website
                  </a>
                </li>
                <li>
                  <h3 className="font-bold">Relate</h3>
                  <p className="text-sm mb-1">Relationship counselling and support</p>
                  <a href="#" className="text-govuk-blue hover:underline text-sm">
                    Visit website
                  </a>
                </li>
                <li>
                  <h3 className="font-bold">Citizens Advice</h3>
                  <p className="text-sm mb-1">Free, confidential advice on legal matters</p>
                  <a href="#" className="text-govuk-blue hover:underline text-sm">
                    Visit website
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-300 p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-govuk-blue mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Emergency support</h3>
                  <p className="text-sm mb-1">If you or your children are in immediate danger, call 999.</p>
                  <p className="text-sm mb-1">National Domestic Abuse Helpline: 0808 2000 247 (24 hours)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Help;
