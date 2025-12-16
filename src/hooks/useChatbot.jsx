import React, { createContext, useContext, useState, useMemo } from 'react';

// ChatbotContext 생성
const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  const [chatbotType, setChatbotType] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = (type) => {
    setChatbotType(type);
    setIsChatbotOpen(true);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  const value = useMemo(() => ({
    chatbotType,
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    setChatbotType, // 필요 시 직접 설정 가능하도록
  }), [chatbotType, isChatbotOpen]);

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
