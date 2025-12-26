import { LANGUAGE_FOLDER_MAP } from './language';

// 로컬(public) 디렉터리의 실제 파일명을 기준으로 매핑합니다.
const FILENAME_MAP = {
  story: {
    ko: '한국어.pdf',
    en: '영어.pdf',
    ja: '일본어.pdf',
    zh: '중국어.pdf',
    es: '스페인어.pdf',
  },
  dreampath: {
    ko: '한국어.pdf',
    en: '영어.pdf',
    ja: '일본어.pdf',
    zh: '중국어.pdf',
    es: '스페인어.pdf',
  },
  innoworks: {
    ko: '한국어.pdf',
    en: '영어.pdf',
    ja: '일본어.pdf',
    zh: '중국어(간체).pdf',
    es: '스페인어.pdf',
  },
};

export function getStoryPdfPath(lang) {
  const filename = FILENAME_MAP.story[lang] || FILENAME_MAP.story.ko;
  if (lang === 'ko') return `/StoryAI/Story-Pdf/${filename}`;
  const folder = LANGUAGE_FOLDER_MAP[lang] || lang;
  return `/StoryAI/Multilingual/${folder}/storyai-PDF/${filename}`;
}

export function getDreamPathPdfPath(lang) {
  const filename = FILENAME_MAP.dreampath[lang] || FILENAME_MAP.dreampath.ko;
  if (lang === 'ko') return `/DreamPath/DreamPath-Pdf/${filename}`;
  const folder = LANGUAGE_FOLDER_MAP[lang] || lang;
  return `/DreamPath/Multilingual/${folder}/DreamPath-Pdf/${filename}`;
}

export function getInnoworksPdfPath(lang) {
  const filename = FILENAME_MAP.innoworks[lang] || FILENAME_MAP.innoworks.ko;
  if (lang === 'ko') return `/Innoworks/Innoworks-Pdf/${filename}`;
  const folder = LANGUAGE_FOLDER_MAP[lang] || lang;
  return `/Innoworks/Multilingual/${folder}/Innoworks-PDF/${filename}`;
}
