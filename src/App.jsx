import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy loading - 각 페이지를 필요할 때만 불러옴
const FrienderPage = lazy(() => import('./components/FrienderPage'));
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

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* 기존 Friender 페이지 */}
          <Route path="/" element={<FrienderPage />} />
          
          {/* DreamPath 페이지 - 언어별 라우트 */}
          <Route path="/dreampath/:language" element={<DreamPathPage />} />

          {/* Story 페이지 - 언어별 라우트 */}
          <Route path="/story/:language" element={<StoryPage />} />

          {/* InnoWorks 페이지 - 언어별 라우트 */}
          <Route path="/innoworks/:language" element={<InnoWorksPage />} />
          
          {/* 기본 경로는 Friender로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
      </Suspense>
    </>
  );
}

export default App;
