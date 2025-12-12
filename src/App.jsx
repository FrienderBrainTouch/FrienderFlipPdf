import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import FrienderPage from './components/FrienderPage';
import FrienderPageKo from './components/FrienderPage-ko';
import FrienderPageEn from './components/FrienderPage-en';
import FrienderPageJa from './components/FrienderPage-ja';
import FrienderPageZh from './components/FrienderPage-zh';
import FrienderPageEs from './components/FrienderPage-es';
import { detectBrowserLanguage, getLanguagePath } from './utils/language';

// 브라우저 언어 감지 및 리다이렉트 컴포넌트
function LanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 이미 언어 경로가 있으면 리다이렉트하지 않음
    if (location.pathname !== '/') {
      return;
    }

    // 브라우저 언어 감지
    const browserLang = detectBrowserLanguage();
    const targetPath = getLanguagePath(browserLang);

    // 기본 언어(한국어)가 아니면 리다이렉트
    if (browserLang !== 'ko') {
      navigate(targetPath, { replace: true });
    }
  }, [navigate, location]);

  return null;
}

function App() {
  return (
    <>
      <LanguageRedirect />
      <Routes>
        <Route path="/" element={<FrienderPageKo />} />
        <Route path="/ko" element={<FrienderPageKo />} />
        <Route path="/en" element={<FrienderPageEn />} />
        <Route path="/ja" element={<FrienderPageJa />} />
        <Route path="/zh" element={<FrienderPageZh />} />
        <Route path="/es" element={<FrienderPageEs />} />
        {/* 기존 경로 호환성 유지 */}
        <Route path="*" element={<FrienderPageKo />} />
      </Routes>
    </>
  );
}

export default App;
