import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../utils/language';

/**
 * URL 경로에서 페이지 타입과 언어를 추출하는 훅
 * @returns {{pageType: string, language: string}} 페이지 타입과 언어 코드
 */
export function useRouteInfo() {
  const location = useLocation();
  const { pathname } = location;

  const { pageType, language } = useMemo(() => {
    let type = 'home';
    let lang = 'ko';

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 0) {
      const first = segments[0].toLowerCase();

      // segments[0]이 타입인지 확인 (dreampath, story, innoworks)
      if (first === 'dreampath') {
        type = 'dreamPath';
        // segments[1]이 언어
        if (segments.length >= 2 && SUPPORTED_LANGUAGES[segments[1]]) {
          lang = segments[1];
        }
      } else if (first === 'story') {
        type = 'story';
        // segments[1]이 언어
        if (segments.length >= 2 && SUPPORTED_LANGUAGES[segments[1]]) {
          lang = segments[1];
        }
      } else if (first === 'innoworks') {
        type = 'innoWorks';
        // segments[1]이 언어
        if (segments.length >= 2 && SUPPORTED_LANGUAGES[segments[1]]) {
          lang = segments[1];
        }
      } else {
        // 홈 페이지: segments[0]이 언어 코드인 경우 (예: /ko, /en)
        if (SUPPORTED_LANGUAGES[first]) {
          lang = first;
        }
      }
    }

    return { pageType: type, language: lang };
  }, [pathname]);

  return { pageType, language };
}
