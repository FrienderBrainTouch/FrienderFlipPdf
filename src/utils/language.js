// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = {
  ko: { code: 'ko', name: '한국어', nativeName: '한국어' },
  en: { code: 'en', name: 'English', nativeName: 'English' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  zh: { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
};

// 브라우저 언어 감지 및 매핑
export const detectBrowserLanguage = () => {
  // 브라우저 언어 가져오기
  const browserLang = navigator.language || navigator.userLanguage;
  
  // 언어 코드만 추출 (예: 'ko-KR' -> 'ko', 'en-US' -> 'en')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // 지원하는 언어인지 확인
  if (SUPPORTED_LANGUAGES[langCode]) {
    return langCode;
  }
  
  // 기본값은 한국어
  return 'ko';
};

// 언어 코드를 경로로 변환
export const getLanguagePath = (langCode) => {
  // 기본 언어(한국어)는 경로 없이 루트
  if (langCode === 'ko') {
    return '/';
  }
  return `/${langCode}`;
};

// 경로에서 언어 코드 추출
export const getLanguageFromPath = (pathname) => {
  const pathParts = pathname.split('/').filter(Boolean);
  
  if (pathParts.length === 0) {
    return 'ko'; // 기본값
  }
  
  const firstPart = pathParts[0].toLowerCase();
  
  // 지원하는 언어 코드인지 확인
  if (SUPPORTED_LANGUAGES[firstPart]) {
    return firstPart;
  }
  
  return 'ko'; // 기본값
};

// 언어 목록 배열 반환
export const getLanguageList = () => {
  return Object.values(SUPPORTED_LANGUAGES);
};

// 언어별 폴더명 매핑
const LANGUAGE_FOLDER_MAP = {
  ko: null, // 한국어는 기본 경로 사용
  en: 'English',
  ja: 'Japan',
  zh: 'China',
  es: 'Spain',
};

// 언어에 따른 Page 파일 경로 반환
export const getPagePath = (langCode, pageNumber) => {
  const folder = LANGUAGE_FOLDER_MAP[langCode];
  if (folder) {
    return `/FrienderFile/Multilingual/${folder}/Page/${pageNumber}.svg`;
  }
  // 한국어는 기본 경로
  return `/FrienderFile/Page/${pageNumber}.svg`;
};

// 언어에 따른 Popup 파일 경로 반환
export const getPopupPath = (langCode, fileName) => {
  const folder = LANGUAGE_FOLDER_MAP[langCode];
  if (folder) {
    return `/FrienderFile/Multilingual/${folder}/Popup/${fileName}`;
  }
  // 한국어는 기본 경로
  return `/FrienderFile/Popup/${fileName}`;
};
