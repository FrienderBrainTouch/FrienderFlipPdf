import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FrienderPage from './components/FrienderPage';
import DreamPathPage from './components/dreampath/DreamPathPage';

function App() {
  return (
    <Routes>
      {/* 기존 Friender 페이지 */}
      <Route path="/" element={<FrienderPage />} />
      
      {/* DreamPath 페이지 - 언어별 라우트 */}
      <Route path="/dreampath/:language" element={<DreamPathPage />} />
      
      {/* 기본 경로는 Friender로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
