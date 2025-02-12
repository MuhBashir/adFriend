import React, { useEffect, useState, useRef } from 'react';
import { Message } from '../../types';

const AIChatbotSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved messages and API key on component mount
  useEffect(() => {
    chrome.storage.sync.get(['openaiKey', 'chatMessages'], (result) => {
      if (result.openaiKey) setOpenRouterApiKey(result.openaiKey);
      if (result.chatMessages) setMessages(result.chatMessages);
      else
        setMessages([
          {
            text: "Hello! I'm your AI companion. How can I help you today?",
            isBot: true,
          },
        ]);
    });
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    chrome.storage.sync.set({ chatMessages: messages });
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getAIResponse = async (message: string): Promise<string> => {
    if (!openRouterApiKey) throw new Error('API key not configured');

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: message }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices?.[0].message.content || 'No response received';
  };

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    try {
      setIsLoading(true);
      setNewMessage('');

      // Add user message
      setMessages((prev) => [...prev, { text: trimmedMessage, isBot: false }]);

      // Get and add AI response
      const aiReply = await getAIResponse(trimmedMessage);
      setMessages((prev) => [...prev, { text: aiReply, isBot: true }]);
    } catch (err) {
      const error =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: ${error}. Please check your API key and connection.`,
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='card bg-base-200'>
      <div className='card-body'>
        <div className='h-96 overflow-y-auto mb-4'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${message.isBot ? 'chat-start' : 'chat-end'}`}
            >
              <div className='chat-bubble'>{message.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className='chat chat-start'>
              <div className='chat-bubble'>
                <span className='loading loading-dots loading-md'></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            className='input input-bordered flex-1'
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <button
            className='btn btn-primary'
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
          >
            {isLoading ? (
              <span className='loading loading-spinner loading-md'></span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotSection;
