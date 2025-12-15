export function getLanguage() {
    // 1. URL 파라미터에서 언어 확인 (?lang=ko, ?lang=en 등)
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    
    if (langFromUrl) {
      return langFromUrl.toLowerCase();
    }
    
    // 2. 브라우저 언어 감지 (fallback)
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // 지원하는 언어 목록 (기본값: ko)
    const supportedLanguages = ['ko', 'en', 'ja', 'zh-hans', 'es'];
    return supportedLanguages.includes(langCode) ? langCode : 'ko';
  }