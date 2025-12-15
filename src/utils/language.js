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
export const LANGUAGE_FOLDER_MAP = {
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
  
  // 파일명에서 확장자 추출
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  // 한국어는 jpg만 사용
  if (langCode === 'ko') {
    // 한국어는 항상 jpg 확장자 사용
    const finalFileName = fileExtension === 'jpg' || fileExtension === 'jpeg' 
      ? fileName 
      : `${fileNameWithoutExt}.jpg`;
    return `/FrienderFile/Popup/${finalFileName}`;
  }
  
  // 다른 언어들은 파일명 패턴에 따라 확장자 결정
  // jpg 파일이 있는 특정 파일명들 (3-1, 3-2, 3-4)
  const jpgFiles = ['3-1', '3-2', '3-4'];
  const shouldUseJpg = jpgFiles.some(jpgFile => fileNameWithoutExt === jpgFile);
  
  if (shouldUseJpg || fileNameWithoutExt.includes('-img')) {
    // jpg 파일이 있는 경우 또는 -img가 포함된 경우 jpg 확장자 사용
    return `/FrienderFile/Multilingual/${folder}/Popup/${fileNameWithoutExt}.jpg`;
  } else {
    // 그 외의 경우 png 확장자 사용
    return `/FrienderFile/Multilingual/${folder}/Popup/${fileNameWithoutExt}.png`;
  }
};

// 언어별 PDF 파일명 매핑
const PDF_FILENAME_MAP = {
  ko: '프랜더-카탈로그.pdf',
  en: 'Friender-Catalog.pdf',
  ja: 'Friender-カタログ.pdf',
  zh: 'Friender-目录.pdf',
  es: 'Friender-Catalogo.pdf',
};

// 언어에 따른 PDF 파일 경로 반환
export const getPdfPath = (langCode) => {
  const folder = LANGUAGE_FOLDER_MAP[langCode];
  const filename = PDF_FILENAME_MAP[langCode] || PDF_FILENAME_MAP['ko'];
  
  if (folder) {
    return `/FrienderFile/Multilingual/${folder}/Friender-Pdf/${filename}`;
  }
  // 한국어는 기본 경로
  return `/FrienderFile/Friender-Pdf/${filename}`;
};
