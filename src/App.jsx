import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { detectBrowserLanguage, getLanguagePath } from './utils/language';

// Lazy loading - 각 페이지를 필요할 때만 불러옴
const FrienderPageWithLanguage = lazy(() => import('./components/FrienderPageWithLanguage'));
const DreamPathPage = lazy(() => import('./components/dreampath/DreamPathPage'));
const StoryPage = lazy(() => import('./components/story/StoryPage'));
const InnoWorksPage = lazy(() => import('./components/innoworks/InnoWorksPage'));
const Chatbot = lazy(() => import('./components/Chatbot'));

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm">로딩 중...</p>
    </div>
  </div>
);
// 브라우저 언어 감지 및 리다이렉트 컴포넌트
function LanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 이미 언어 경로가 있거나 서브 페이지인 경우 리다이렉트하지 않음
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
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* 다국어 PC 페이지 */}
          <Route path="/" element={<FrienderPageWithLanguage />} />
          <Route path="/:language" element={<FrienderPageWithLanguage />} />

          {/* DreamPath / Story / InnoWorks 언어별 라우트 유지 */}
          <Route path="/dreampath/:language" element={<DreamPathPage />} />
          <Route path="/story/:language" element={<StoryPage />} />
          <Route path="/innoworks/:language" element={<InnoWorksPage />} />

          {/* 기본 경로는 한국어 페이지로 포워딩 */}
          <Route path="*" element={<Navigate to="/ko" replace />} />
        </Routes>
        {/* 챗봇 컴포넌트 */}
        <Chatbot />
      </Suspense>
    </>
  );
}

export default App;
