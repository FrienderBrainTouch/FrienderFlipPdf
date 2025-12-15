/**
 * 챗봇 타입별 테마 색상 설정
 * 
 * 색상을 변경하려면 이 파일만 수정하세요.
 * primary: 메인 색상 (헤더, 버튼, 사용자 메시지 배경)
 * primaryHover: 호버 시 색상
 * primaryLight: 연한 버전 (포커스 링 등)
 */

export const CHATBOT_THEMES = {
  // Friender (홈) - 초록색
  home: {
    primary: '#22c55e',       // green-500
    primaryHover: '#16a34a',  // green-600
    primaryLight: '#86efac',  // green-300
    name: 'Friender',
  },
  
  // DreamPath - 노란색
  dreamPath: {
    primary: '#eab308',       // yellow-500
    primaryHover: '#ca8a04',  // yellow-600
    primaryLight: '#fde047',  // yellow-300
    name: 'DreamPath',
  },
  
  // InnoWorks - 파란색
  innoWorks: {
    primary: '#3b82f6',       // blue-500
    primaryHover: '#2563eb',  // blue-600
    primaryLight: '#93c5fd',  // blue-300
    name: 'InnoWorks',
  },
  
  // AI Story - 주황색
  story: {
    primary: '#f97316',       // orange-500
    primaryHover: '#ea580c',  // orange-600
    primaryLight: '#fdba74',  // orange-300
    name: 'AI Story',
  },
};

/**
 * 타입에 맞는 테마 가져오기
 * @param {string} type - 'home' | 'dreamPath' | 'innoWorks' | 'story'
 * @returns {object} 테마 객체
 */
export const getTheme = (type) => {
  return CHATBOT_THEMES[type] || CHATBOT_THEMES.home;
};
