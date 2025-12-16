import { useParams } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../utils/language';

/**
 * URL 파라미터에서 언어 코드를 추출하고 검증하는 훅
 * @returns {string} 검증된 언어 코드 (기본값: 'ko')
 */
export function useValidLanguage() {
  const { language } = useParams();

  // 지원하는 언어 코드인지 확인, 아니면 기본값 'ko' 사용
  const validLanguage = language && SUPPORTED_LANGUAGES[language] ? language : 'ko';

  return validLanguage;
}
