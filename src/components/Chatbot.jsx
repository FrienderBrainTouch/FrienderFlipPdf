import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Bot, Send } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import { getTheme } from '../config/chatbotTheme';
import { useRouteInfo } from '../hooks/useRouteInfo';

const TRANSLATIONS = {
  ko: {
    chatbot_placeholder: '메시지를 입력하세요...',
    chatbot_title: 'Friender 챗봇',
    chatbot_subtitle: '무엇이든 물어보세요!',
    chatbot_welcome: '안녕하세요! Friender에 오신 것을 환영합니다. 궁금한 점이 있으신가요?',
    
    chatbot_home_title: 'Friender 도우미',
    chatbot_home_subtitle: '회사 소개 및 일반 문의',
    chatbot_home_welcome: '안녕하세요! Friender에 대해 무엇이든 물어보세요.',
    chatbot_home_response_default: '죄송합니다. 이해하지 못했습니다. 다시 말씀해 주시겠어요?',
    chatbot_home_response_error: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',

    chatbot_story_title: 'Friender 스토리',
    chatbot_story_subtitle: '우리의 여정을 들려드립니다',
    chatbot_story_welcome: 'Friender의 성장 스토리와 비전에 대해 궁금한 점을 물어보세요!',

    chatbot_dreamPath_title: 'DreamPath 가이드',
    chatbot_dreamPath_subtitle: '진로 탐색 도우미',
    chatbot_dreamPath_welcome: '꿈을 향한 여정, DreamPath에 대해 안내해 드립니다.',

    chatbot_innoWorks_title: 'InnoWorks 소개',
    chatbot_innoWorks_subtitle: '혁신적인 기술과 솔루션',
    chatbot_innoWorks_welcome: 'Friender의 기술력과 InnoWorks 프로젝트에 대해 설명해 드릴게요.',
  },
  en: {
    chatbot_placeholder: 'Type your message...',
    chatbot_title: 'Friender Chatbot',
    chatbot_subtitle: 'Ask me anything!',
    chatbot_welcome: 'Hello! Welcome to Friender. How can I help you today?',
    
    chatbot_home_title: 'Friender Assistant',
    chatbot_home_subtitle: 'General Inquiries',
    chatbot_home_welcome: 'Hello! Ask me anything about Friender.',
    chatbot_home_response_default: 'I apologize, I did not understand. Could you please rephrase?',
    chatbot_home_response_error: 'Sorry, an error occurred. Please try again later.',

    chatbot_story_title: 'Friender Story',
    chatbot_story_subtitle: 'Our Journey',
    chatbot_story_welcome: "Ask about Friender's growth story and vision!",

    chatbot_dreamPath_title: 'DreamPath Guide',
    chatbot_dreamPath_subtitle: 'Career Path Assistant',
    chatbot_dreamPath_welcome: 'Let me guide you through DreamPath, the journey to your dreams.',

    chatbot_innoWorks_title: 'InnoWorks Info',
    chatbot_innoWorks_subtitle: 'Innovation & Solutions',
    chatbot_innoWorks_welcome: "I can explain Friender's technology and InnoWorks projects.",
  },
  ja: {
    chatbot_placeholder: 'メッセージを入力してください...',
    chatbot_title: 'Friender チャットボット',
    chatbot_subtitle: '何でも聞いてください！',
    chatbot_welcome: 'こんにちは！Frienderへようこそ。ご用件をお聞かせください。',
    
    chatbot_home_title: 'Friender アシスタント',
    chatbot_home_subtitle: '会社紹介と一般案内',
    chatbot_home_welcome: 'Frienderについて何でもお尋ねください。',
    chatbot_home_response_default: 'すみません、理解できませんでした。もう一度お願いします。',
    chatbot_home_response_error:
      '申し訳ありません。エラーが発生しました。しばらくしてからお試しください。',

    chatbot_story_title: 'Friender ストーリー',
    chatbot_story_subtitle: '私たちの歩み',
    chatbot_story_welcome: 'Frienderの成長ストーリーやビジョンについてお尋ねください！',

    chatbot_dreamPath_title: 'DreamPath ガイド',
    chatbot_dreamPath_subtitle: 'キャリア探索サポート',
    chatbot_dreamPath_welcome: '夢への旅路、DreamPathについてご案内します。',

    chatbot_innoWorks_title: 'InnoWorks 紹介',
    chatbot_innoWorks_subtitle: '革新的な技術とソリューション',
    chatbot_innoWorks_welcome: 'Frienderの技術力とInnoWorksプロジェクトをご説明します。',
  },
  es: {
    chatbot_placeholder: 'Escribe tu mensaje...',
    chatbot_title: 'Chatbot de Friender',
    chatbot_subtitle: 'Pregunta lo que quieras!',
    chatbot_welcome: 'Hola! Bienvenido a Friender. Como puedo ayudarte hoy?',
    
    chatbot_home_title: 'Asistente de Friender',
    chatbot_home_subtitle: 'Consultas generales',
    chatbot_home_welcome: 'Hola! Pregunta lo que quieras sobre Friender.',
    chatbot_home_response_default: 'Lo siento, no entendi. Podrias reformularlo?',
    chatbot_home_response_error: 'Lo siento, se produjo un error. Intentalo de nuevo mas tarde.',

    chatbot_story_title: 'Historia de Friender',
    chatbot_story_subtitle: 'Nuestro viaje',
    chatbot_story_welcome: 'Pregunta sobre la historia y la vision de Friender!',

    chatbot_dreamPath_title: 'Guia de DreamPath',
    chatbot_dreamPath_subtitle: 'Asistente de trayectoria profesional',
    chatbot_dreamPath_welcome: 'Te guiaremos por DreamPath, el camino a tus suenos.',

    chatbot_innoWorks_title: 'Info de InnoWorks',
    chatbot_innoWorks_subtitle: 'Innovacion y soluciones',
    chatbot_innoWorks_welcome:
      'Puedo explicarte la tecnologia de Friender y los proyectos InnoWorks.',
  },
  zh: {
    chatbot_placeholder: '请输入消息...',
    chatbot_title: 'Friender 聊天机器人',
    chatbot_subtitle: '有什么都可以问！',
    chatbot_welcome: '你好！欢迎来到 Friender。我能帮你做什么？',
    
    chatbot_home_title: 'Friender 助理',
    chatbot_home_subtitle: '公司介绍与常见咨询',
    chatbot_home_welcome: '关于 Friender 有任何问题都可以问我。',
    chatbot_home_response_default: '抱歉，我没有理解。可以再说一遍吗？',
    chatbot_home_response_error: '抱歉，发生错误，请稍后再试。',

    chatbot_story_title: 'Friender 故事',
    chatbot_story_subtitle: '我们的旅程',
    chatbot_story_welcome: '欢迎询问 Friender 的成长故事和愿景！',

    chatbot_dreamPath_title: 'DreamPath 指南',
    chatbot_dreamPath_subtitle: '职业路径助手',
    chatbot_dreamPath_welcome: '让我为你介绍通往梦想的 DreamPath。',

    chatbot_innoWorks_title: 'InnoWorks 介绍',
    chatbot_innoWorks_subtitle: '创新技术与解决方案',
    chatbot_innoWorks_welcome: '我可以介绍 Friender 的技术力和 InnoWorks 项目。',
  },
};

const Chatbot = () => {
  const { isChatbotOpen, closeChatbot, openChatbot } = useChatbot();
  const { pageType, language: currentLang } = useRouteInfo();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  // 페이지 타입을 챗봇 타입으로 매핑
  const activeChatbotType = pageType === 'dreamPath' ? 'dreamPath' : pageType;

  // 번역 헬퍼
  const t = (key) => {
    const langSet = TRANSLATIONS[currentLang] || TRANSLATIONS['ko'];
    return langSet[key] || TRANSLATIONS['ko'][key] || key;
  };

  // DocID 매핑
  const getDocId = () => {
    const docIdMap = {
      home: import.meta.env.VITE_CHATBOT_DOC_ID_HOME,
      story: import.meta.env.VITE_CHATBOT_DOC_ID_STORY,
      dreamPath: import.meta.env.VITE_CHATBOT_DOC_ID_DREAM_PATH,
      innoWorks: import.meta.env.VITE_CHATBOT_DOC_ID_INNO_WORKS,
    };
    return docIdMap[activeChatbotType] || '';
  };

  const handleToggle = () => {
    if (isChatbotOpen) {
      closeChatbot();
    } else {
      openChatbot(activeChatbotType);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isChatbotOpen]);

  // 챗봇 타입 변경 시 메시지 초기화 (선택 사항)
  useEffect(() => {
    setMessages([]);
  }, [activeChatbotType, currentLang]);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsgText = inputMessage.trim();
    const userMessage = {
      text: userMsgText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_CHATBOT_API_URL;
      
      let responseData = { message: '' };
      
      if (apiUrl) {
        // 실제 API 호출
        const payload = {
          docId: getDocId(),
          message: userMsgText,
          language: currentLang,
        };

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        responseData = await res.json();
      } else {
        // Fallback for dev without env
        console.warn('VITE_CHATBOT_API_URL is missing');
        await new Promise((r) => setTimeout(r, 1000));
        responseData = {
          message: `${t('chatbot_' + activeChatbotType + '_response_default')} (Demo)`,
        };
      }

      const replyText =
        responseData?.answer ||
        responseData?.message ||
        t(`chatbot_${activeChatbotType}_response_default`);

      const botMessage = {
        text: replyText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorMessage = {
        text: t(`chatbot_${activeChatbotType}_response_error`),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getTitle = () => t(`chatbot_${activeChatbotType}_title`) || t('chatbot_title');
  const getSubtitle = () => t(`chatbot_${activeChatbotType}_subtitle`) || t('chatbot_subtitle');
  const getWelcomeMessage = () => t(`chatbot_${activeChatbotType}_welcome`) || t('chatbot_welcome');

  // 현재 타입에 맞는 테마 색상 가져오기
  const theme = getTheme(activeChatbotType);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 챗봇 버튼 */}
      {!isChatbotOpen && (
        <button
          onClick={handleToggle}
          style={{ backgroundColor: theme.primary }}
          className="w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.primary)}
          aria-label="챗봇 열기"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* 챗봇 창 */}
      {isChatbotOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* 헤더 */}
          <div
            style={{ backgroundColor: theme.primary }}
            className="text-white p-4 rounded-t-lg flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{getTitle()}</h3>
                <p className="text-xs text-white/80">{getSubtitle()}</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="챗봇 닫기"
            >
              <X size={20} />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            ref={messagesContainerRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 ${
              messages.length === 0 ? 'flex items-center justify-center' : ''
            }`}
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-500 px-6">
                <Bot
                  size={48}
                  style={{ color: theme.primary }}
                  className="mx-auto mb-3 opacity-50"
                />
                <p className="text-sm leading-relaxed">{getWelcomeMessage()}</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    message.sender === 'user'
                      ? 'text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                  style={message.sender === 'user' ? { backgroundColor: theme.primary } : {}}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-lg">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                type="text"
                placeholder={t('chatbot_placeholder')}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:border-transparent text-sm !bg-white !text-black !placeholder-gray-500 hover:bg-gray-50 transition-colors"
                style={{ '--tw-ring-color': theme.primaryLight }}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  backgroundColor: !inputMessage.trim() || isTyping ? undefined : theme.primary,
                }}
                className="w-10 h-10 flex items-center justify-center text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 shadow-sm"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = theme.primaryHover;
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = theme.primary;
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
