import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Book from './components/Book';
import VQBook from './components/VQBook';
import IntroScreen from './components/IntroScreen';
import VQMainPage from './components/VQMainPage';
import CompanyPage from './components/CompanyPage';
import ContactPage from './components/ContactPage';
import PortfolioPage from './components/PortfolioPage';
import Chatbot from './components/Chatbot';
import IsoverPage from './components/IsoverPage';

function App() {
  /** 대화 로그를 전역(최상단)에서 관리 */
  const [logs, setLogs] = useState([]);

  /** 최초 진입 시 URL에 따라 화면 분기 */
  const getInitialBookType = () => {
    const path = window.location.pathname;
    if (path === '/friender') return 'friender';
    if (path === '/vq') return 'vq';
    if (path === '/vq-main') return 'vq-main';
    if (path === '/company') return 'company';
    if (path === '/contact') return 'contact';
    if (path === '/portfolio') return 'portfolio';
    if (path === '/catalog') return 'catalog';
    if (path === '/isover') return 'isover';
    return 'isover'; // 기본값을 isover로 변경
  };

  /** 현재 화면 상태 */
  const [selectedBook, setSelectedBook] = useState(getInitialBookType());

  /** 화면(라우팅) 전환 핸들러 */
  const handleBookChange = (bookType) => {
    setSelectedBook(bookType);
    const newPath = bookType === 'vq-main' ? '/' : `/${bookType}`;
    window.history.pushState({}, '', newPath);
  };

  const handleUserMessage = (text, raw) => {
    // 예: 사용자가 "go vq"라고 입력하면 /vq로 이동
    if (text?.toLowerCase() === 'go vq') {
      handleBookChange('vq');
    }

    console.log('👤 사용자 입력:', text);

    setLogs((prev) => [...prev, { role: 'user', text, raw }]);
  };

  const handleBotMessage = (text, raw) => {
    console.log('🤖 챗봇 응답:', text);
    setLogs((prev) => [...prev, { role: 'bot', text, raw }]);
  };

  useEffect(() => {
    // console.log('🧾 최신 로그 상태:', logs);
  }, [logs]);

  // Isover 페이지 (기본 페이지)
  if (selectedBook === 'isover') {
    return <IsoverPage />;
  }

  // VQ 메인 페이지
  if (selectedBook === 'vq-main') {
    return <VQMainPage />;
  }

  // 회사소개 페이지
  if (selectedBook === 'company') {
    return <CompanyPage />;
  }

  // 문의하기 페이지
  if (selectedBook === 'contact') {
    return <ContactPage />;
  }

  // 포트폴리오 페이지
  if (selectedBook === 'portfolio') {
    return <PortfolioPage />;
  }

  // 카탈로그 페이지
  if (selectedBook === 'catalog') {
    return (
      <div className="w-full min-h-screen bg-[#0e1a26]">
        <IntroScreen onBack={() => handleBookChange('vq-main')} />
        <Chatbot onUserMessage={handleUserMessage} onBotMessage={handleBotMessage} />
      </div>
    );
  }

  // 그 외 화면
  return (
    <div className="w-full min-h-screen bg-[#0e1a26]">
      <Header selectedBook={selectedBook} onBookChange={handleBookChange} />
      <div className="flex-1">{selectedBook === 'friender' ? <Book /> : <VQBook />}</div>
    </div>
  );
}

export default App;
