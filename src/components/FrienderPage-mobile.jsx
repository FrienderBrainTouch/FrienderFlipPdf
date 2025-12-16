import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Frender3DModel from './Frender3DModel';
import Chatbot from './Chatbot';
import { getLanguageList, getLanguageFromPath, getLanguagePath, getPagePath, getPopupPath, getPdfPath, getFrontGifPath } from '../utils/language';
import { getTranslation } from '../utils/translations';

const getDroneVideoPlaylist = (t) => [
  {
    title: t('droneTheoryConcept'),
    category: t('droneTheory'),
    description: t('droneTheoryConceptDesc'),
    url: 'https://youtu.be/hmxy1YirO4o?si=M1xnCj9c97hTthcf',
  },
  {
    title: t('droneTheoryStructure'),
    category: t('droneTheory'),
    description: t('droneTheoryStructureDesc'),
    url: 'https://youtu.be/d_sz10Lu7cs?si=APcTWNFVp6H5dADX',
  },
  {
    title: t('droneTheoryPrinciple'),
    category: t('droneTheory'),
    description: t('droneTheoryPrincipleDesc'),
    url: 'https://youtu.be/VHH91q3uO0I?si=1hrRYfx0IC-xwb3L',
  },
  {
    title: t('droneTheorySafety'),
    category: t('droneTheory'),
    description: t('droneTheorySafetyDesc'),
    url: 'https://youtu.be/9E1OXKQhXQg?si=hugFJTE2P0uMd3Y6',
  },
  {
    title: t('dronePracticeRescue'),
    category: t('dronePractice'),
    description: t('dronePracticeRescueDesc'),
    url: 'https://youtu.be/Z1B4cOrv84c?si=m0SQWZlrjC5aWjSI',
  },
  {
    title: t('dronePracticeFire'),
    category: t('dronePractice'),
    description: t('dronePracticeFireDesc'),
    url: 'https://youtu.be/bEeKg5p4fJw?si=RQC6FMFBOsErjkBm',
  },
  {
    title: t('droneTrack'),
    category: t('droneTrack'),
    description: t('droneTrackDesc'),
    url: 'https://youtu.be/_ruoKMR3ZEU?si=A2XLRpHrCCuURJiQ',
  },
];

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    : '';
};

const getPage6MediaOverrides = (t) => ({
  5: {
    src: '/FrienderFile/VideoFile/WorldGIF.gif',
    alt: t('worldGifAnimation'),
  },
  6: {
    src: '/FrienderFile/VideoFile/FrinederGIF1.gif',
    alt: t('frienderGifAnimation'),
  },
});

const getPage7MediaOverrides = (t) => ({
  5: {
    src: '/FrienderFile/VideoFile/AIStory.gif',
    alt: t('aiStoryGifAnimation'),
  },
  6: {
    src: '/FrienderFile/VideoFile/DreampathAI.gif',
    alt: t('dreampathAiGifAnimation'),
  },
  7: {
    src: '/FrienderFile/VideoFile/InnoWorks.gif',
    alt: t('innoWorksGifAnimation'),
  },
});

const NAVER_MAP_ADDRESS = '경기도 부천시 원미구 길주로 17, 웹툰융합센터 6층 608호';
const NAVER_MAP_COORDINATES = {
  lat: 37.5047267,
  lng: 126.7870631,
};
const NAVER_MAP_QUERY = encodeURIComponent(NAVER_MAP_ADDRESS);
const NAVER_MAP_EMBED_URL = `https://map.naver.com/p/search/${NAVER_MAP_QUERY}?c=${NAVER_MAP_COORDINATES.lng},${NAVER_MAP_COORDINATES.lat},21,0,0,0,dh`;
const NAVER_MAP_SHARE_URL = `https://map.naver.com/p/search/${NAVER_MAP_QUERY}?c=${NAVER_MAP_COORDINATES.lng},${NAVER_MAP_COORDINATES.lat},21,0,0,0,dh`;

const handleOpenNaverMap = () => {
  window.open(NAVER_MAP_SHARE_URL, '_blank', 'noopener,noreferrer');
};

/**
 * FrienderPage-mobile 컴포넌트
 *
 * 이 컴포넌트는 모바일용 Friender 페이지를 구현합니다.
 * 주요 기능:
 * - 초기 로딩 애니메이션 (Friender 로고)
 * - 흰 화면에서 본 화면으로의 전환 효과
 * - 중앙 이미지 애니메이션
 * - 스크롤 방식 페이지 네비게이션
 * - 네비게이션 및 툴바 기능
 */
function FrienderPageMobile({ onBack = null, language: propLanguage }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 현재 언어 감지
  const currentLanguage = propLanguage || getLanguageFromPath(location.pathname);
  const languageList = getLanguageList();
  
  // 번역 함수
  const t = (key) => getTranslation(currentLanguage, key);
  
  // 언어 선택 드롭다운 상태
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  
  // 언어 변경 핸들러
  const handleLanguageChange = (langCode) => {
    const targetPath = getLanguagePath(langCode);
    navigate(targetPath);
    setIsLanguageDropdownOpen(false);
  };
  
  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    
    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);
  
  // 상태 관리 변수들
  const [showIntro, setShowIntro] = useState(true); // 인트로 화면 표시 여부
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도
  const [whiteScreenVisible, setWhiteScreenVisible] = useState(true); // 흰 화면 표시 여부
  const [mainScreenVisible, setMainScreenVisible] = useState(false); // 본 화면 표시 여부
  const [imageScale, setImageScale] = useState(1.2); // 중앙 이미지 스케일 (120%에서 시작)
  const [imageOpacity, setImageOpacity] = useState(0); // 중앙 이미지 투명도

  // 3D 모델 뷰어 상태 관리 (표지 페이지에서만 표시)
  const [show3DModel, setShow3DModel] = useState(true);

  // 3D 모델 모달 상태 관리
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  // 6페이지 3D 모델 모달 상태 관리
  const [isPage63DModalOpen, setIsPage63DModalOpen] = useState(false);

  // front.gif 표시 상태 관리
  const [showFrontGif, setShowFrontGif] = useState(false);
  const [showSvgBackground, setShowSvgBackground] = useState(false);

  // 3페이지 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // 3페이지 이미지 모달 상태 관리
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState(null); // '3-4-1', '3-4-2', '3-6-1'

  // 추가 4개 영역 모달 상태 관리
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);
  const [selectedAdditionalArea, setSelectedAdditionalArea] = useState(null);

  // 4페이지 모달 상태 관리
  const [isPage4ModalOpen, setIsPage4ModalOpen] = useState(false);
  const [selectedPage4Area, setSelectedPage4Area] = useState(null);
  const [isPage4ModalJustOpened, setIsPage4ModalJustOpened] = useState(false);
  const [isPage4ModalJustClosed, setIsPage4ModalJustClosed] = useState(false);

  // 4페이지 영역 2번 전용 모달 상태 관리 (테스트용)
  const [isPage4Area2ModalOpen, setIsPage4Area2ModalOpen] = useState(false);

  // 5페이지 모달 상태 관리
  const [isPage5ModalOpen, setIsPage5ModalOpen] = useState(false);
  const [selectedPage5Area, setSelectedPage5Area] = useState(null);
  const [isPage5ModalJustOpened, setIsPage5ModalJustOpened] = useState(false);
  const [isPage5ModalJustClosed, setIsPage5ModalJustClosed] = useState(false);

  // 5페이지 3D 모델 모달 상태 관리
  const [isPage53DModalOpen, setIsPage53DModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(1); // 선택된 파트 (1-4)
  const [currentPartModel, setCurrentPartModel] = useState(null); // 현재 표시할 파트 모델
  const [isPage53DModelLoading, setIsPage53DModelLoading] = useState(false); // 5페이지 3D 모델 로딩 상태
  const [modalKey, setModalKey] = useState(0); // 모달 새로고침을 위한 키

  // 5페이지 외장재 모달 상태 관리
  const [isPage5ExteriorModalOpen, setIsPage5ExteriorModalOpen] = useState(false);
  const [selectedExteriorType, setSelectedExteriorType] = useState(null); // 선택된 외장재 타입 (3-6)

  // 6페이지 모달 상태 관리
  const [isPage6ModalOpen, setIsPage6ModalOpen] = useState(false);
  const [selectedPage6Area, setSelectedPage6Area] = useState(null);
  const [isPage6ModalJustOpened, setIsPage6ModalJustOpened] = useState(false);
  const [isPage6ModalJustClosed, setIsPage6ModalJustClosed] = useState(false);
  const page6MediaOverrides = getPage6MediaOverrides(t);
  const page6MediaOverride = useMemo(() => {
    return selectedPage6Area && page6MediaOverrides[selectedPage6Area] 
      ? page6MediaOverrides[selectedPage6Area] 
      : null;
  }, [selectedPage6Area, page6MediaOverrides]);
  
  // 추가 영역 이미지 모달 상태 관리 (돋보기 없이 단순 이미지 표시)
  const [isAdditionalImageModalOpen, setIsAdditionalImageModalOpen] = useState(false);
  const [selectedAdditionalImageType, setSelectedAdditionalImageType] = useState(null);

  // 7페이지 모달 상태 관리
  const [isPage7ModalOpen, setIsPage7ModalOpen] = useState(false);
  const [selectedPage7Area, setSelectedPage7Area] = useState(null);
  const [isPage7ModalJustOpened, setIsPage7ModalJustOpened] = useState(false);
  const [isPage7ModalJustClosed, setIsPage7ModalJustClosed] = useState(false);
  const page7MediaOverrides = getPage7MediaOverrides(t);
  const page7MediaOverride = selectedPage7Area ? page7MediaOverrides[selectedPage7Area] : null;
  
  // 7페이지 영상 상태 관리
  const [showVideo, setShowVideo] = useState(false);

  // 8페이지 모달 상태 관리
  const [isPage8ModalOpen, setIsPage8ModalOpen] = useState(false);
  const [selectedPage8Area, setSelectedPage8Area] = useState(null);
  const [isPage8ModalJustOpened, setIsPage8ModalJustOpened] = useState(false);
  const [isPage8ModalJustClosed, setIsPage8ModalJustClosed] = useState(false);

  // 2페이지 모달 상태 관리
  const [isPage2ModalOpen, setIsPage2ModalOpen] = useState(false);
  const [selectedPage2Area, setSelectedPage2Area] = useState(null);
  const [isPage2ModalJustOpened, setIsPage2ModalJustOpened] = useState(false);
  const [isPage2ModalJustClosed, setIsPage2ModalJustClosed] = useState(false);

  // 2페이지 모달 상태 변화 추적
  useEffect(() => {
    // 모달이 열릴 때 짧은 시간 동안 배경 클릭 무시
    if (isPage2ModalOpen) {
      setIsPage2ModalJustOpened(true);
      setIsPage2ModalJustClosed(false);
      const timer = setTimeout(() => {
        setIsPage2ModalJustOpened(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage2ModalJustOpened(false);
      // 모달이 닫힐 때 짧은 시간 동안 영역 클릭 무시
      if (selectedPage2Area === null) {
        setIsPage2ModalJustClosed(true);
        const timer = setTimeout(() => {
          setIsPage2ModalJustClosed(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage2ModalOpen, selectedPage2Area]);

  // 9페이지 모달 상태 관리
  const [isPage9ModalOpen, setIsPage9ModalOpen] = useState(false);
  const [selectedPage9Area, setSelectedPage9Area] = useState(null);
  const [isPage9ModalJustOpened, setIsPage9ModalJustOpened] = useState(false);
  const [isPage9ModalJustClosed, setIsPage9ModalJustClosed] = useState(false);

  // 10페이지 모달 상태 관리
  const [isPage10ModalOpen, setIsPage10ModalOpen] = useState(false);
  const [selectedPage10Area, setSelectedPage10Area] = useState(null);
  const [isPage10ModalJustOpened, setIsPage10ModalJustOpened] = useState(false);
  const [isPage10ModalJustClosed, setIsPage10ModalJustClosed] = useState(false);

  // 11페이지 모달 상태 관리
  const [isPage11ModalOpen, setIsPage11ModalOpen] = useState(false);
  const [isPage11ModalJustOpened, setIsPage11ModalJustOpened] = useState(false);
  const [isPage11ModalJustClosed, setIsPage11ModalJustClosed] = useState(false);

  // 3페이지 팝업 모달 상태 관리
  const [isPage3ModalOpen, setIsPage3ModalOpen] = useState(false);
  const [selectedPage3Area, setSelectedPage3Area] = useState(null);
  const [isPage3ModalJustOpened, setIsPage3ModalJustOpened] = useState(false);
  const [isPage3ModalJustClosed, setIsPage3ModalJustClosed] = useState(false);

  // 모달 확대/축소 상태 관리
  const [modalZoomLevel, setModalZoomLevel] = useState(1);
  const [isModalZoomed, setIsModalZoomed] = useState(false);
  const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = useState(false);
  const modalDragStartRef = useRef({ x: 0, y: 0 });

  // 튜토리얼 모드 상태 관리
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [tutorialTooltip, setTutorialTooltip] = useState(null); // 현재 표시된 영역의 툴팁
  const [tutorialTooltipPosition, setTutorialTooltipPosition] = useState({ x: 0, y: 0 });
  const [tutorialTooltipDirection, setTutorialTooltipDirection] = useState('top');
  const [tutorialTooltipShown, setTutorialTooltipShown] = useState(new Set()); // 툴팁이 표시된 영역 추적

  // ref 변수들
  const animationRef = useRef(null);

  // 3페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage3ModalOpen) {
      setIsPage3ModalJustOpened(true);
      setIsPage3ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage3ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage3ModalJustOpened(false);
      if (selectedPage3Area === null) {
        setIsPage3ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage3ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage3ModalOpen, selectedPage3Area]);

  // 4페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage4ModalOpen) {
      setIsPage4ModalJustOpened(true);
      setIsPage4ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage4ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage4ModalJustOpened(false);
      if (selectedPage4Area === null) {
        setIsPage4ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage4ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage4ModalOpen, selectedPage4Area]);

  // 5페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage5ModalOpen) {
      setIsPage5ModalJustOpened(true);
      setIsPage5ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage5ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage5ModalJustOpened(false);
      if (selectedPage5Area === null) {
        setIsPage5ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage5ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage5ModalOpen, selectedPage5Area]);

  // 6페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage6ModalOpen) {
      setIsPage6ModalJustOpened(true);
      setIsPage6ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage6ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage6ModalJustOpened(false);
      if (selectedPage6Area === null) {
        setIsPage6ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage6ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage6ModalOpen, selectedPage6Area]);

  // 7페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage7ModalOpen) {
      setIsPage7ModalJustOpened(true);
      setIsPage7ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage7ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage7ModalJustOpened(false);
      if (selectedPage7Area === null) {
        setIsPage7ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage7ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage7ModalOpen, selectedPage7Area]);

  // 8페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage8ModalOpen) {
      setIsPage8ModalJustOpened(true);
      setIsPage8ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage8ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage8ModalJustOpened(false);
      if (selectedPage8Area === null) {
        setIsPage8ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage8ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage8ModalOpen, selectedPage8Area]);

  // 9페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage9ModalOpen) {
      setIsPage9ModalJustOpened(true);
      setIsPage9ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage9ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage9ModalJustOpened(false);
      if (selectedPage9Area === null) {
        setIsPage9ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage9ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage9ModalOpen, selectedPage9Area]);

  // 10페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage10ModalOpen) {
      setIsPage10ModalJustOpened(true);
      setIsPage10ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage10ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage10ModalJustOpened(false);
      if (selectedPage10Area === null) {
        setIsPage10ModalJustClosed(true);
        const timer = setTimeout(() => setIsPage10ModalJustClosed(false), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isPage10ModalOpen, selectedPage10Area]);

  // 11페이지 모달 상태 변화 추적
  useEffect(() => {
    if (isPage11ModalOpen) {
      setIsPage11ModalJustOpened(true);
      setIsPage11ModalJustClosed(false);
      const timer = setTimeout(() => setIsPage11ModalJustOpened(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsPage11ModalJustOpened(false);
      setIsPage11ModalJustClosed(true);
      const timer = setTimeout(() => setIsPage11ModalJustClosed(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isPage11ModalOpen]);

  /**
   * 중앙 이미지 애니메이션 시작 함수
   */
  const startImageAnimation = () => {
    // 배경 이미지는 즉시 표시
    setImageScale(1);
    setImageOpacity(1);
  };

  /**
   * 반응형 이미지 크기 계산 함수
   * @param {number} baseSize - 기본 크기
   * @returns {number} 조정된 크기
   */
  const getResponsiveImageSize = (baseSize) => {
    const isLargeScreen = window.innerWidth >= 1024;
    return isLargeScreen ? baseSize : baseSize * 0.8;
  };

  // Friender 페이지별 이미지 데이터 (11페이지) - 언어별 경로 적용
  const pageImages = useMemo(() => [
    {
      id: 0,
      name: "표지",
      backgroundImage: getPagePath(currentLanguage, 1),
      overlays: []
    },
    {
      id: 1,
      name: t('page1'),
      backgroundImage: getPagePath(currentLanguage, 2),
      overlays: []
    },
    {
      id: 2,
      name: t('page2'), 
      backgroundImage: getPagePath(currentLanguage, 3),
      overlays: []
    },
    {
      id: 3,
      name: t('page3'),
      backgroundImage: getPagePath(currentLanguage, 4),
      overlays: []
    },
    {
      id: 4,
      name: t('page4'),
      backgroundImage: getPagePath(currentLanguage, 5),
      overlays: []
    },
    {
      id: 5,
      name: t('page5'),
      backgroundImage: getPagePath(currentLanguage, 6),
      overlays: []
    },
    {
      id: 6,
      name: t('page6'),
      backgroundImage: getPagePath(currentLanguage, 7),
      overlays: []
    },
    {
      id: 7,
      name: t('page7'),
      backgroundImage: getPagePath(currentLanguage, 8),
      overlays: []
    },
    {
      id: 8,
      name: t('page8'),
      backgroundImage: getPagePath(currentLanguage, 9),
      overlays: []
    },
    {
      id: 9,
      name: t('page9'),
      backgroundImage: getPagePath(currentLanguage, 10),
      overlays: []
    },
    {
      id: 10,
      name: t('page10'),
      backgroundImage: getPagePath(currentLanguage, 11),
      overlays: []
    }
  ], [currentLanguage]);


  // front.gif 3.2초 후 자동 비활성화, 3초에 SVG 배경 활성화
  useEffect(() => {
    if (showFrontGif) {
      // 3초에 SVG 배경 활성화
      const svgTimer = setTimeout(() => {
        setShowSvgBackground(true);
      }, 3000);

      // 3.2초에 gif 비활성화
      const gifTimer = setTimeout(() => {
        setShowFrontGif(false);
      }, 3200);

      return () => {
        clearTimeout(svgTimer);
        clearTimeout(gifTimer);
      };
    }
  }, [showFrontGif]);

  // 2단계: 흰 화면이 위로 사라지는 전환
  const startTransition = React.useCallback(() => {
    setWhiteScreenVisible(false);

    // 전환 완료 후 본 화면 표시
    setTimeout(() => {
      setMainScreenVisible(true);
      startImageAnimation();
      // 인트로 완료 후 1초 뒤에 GIF 시작
      setTimeout(() => {
        setShowFrontGif(true);
      }, 1000);
    }, 500);
  }, []);

  // 로고 애니메이션 완료 후 화면 전환
  useEffect(() => {
    if (logoOpacity === 1) {
      // 로고 애니메이션이 완료되면 0.5초 후 2단계 시작
      setTimeout(() => {
        startTransition();
      }, 500);
    }
  }, [logoOpacity, startTransition]);

  /**
   * 컴포넌트 마운트 시 애니메이션 시퀀스 실행
   */
  useEffect(() => {
    // 로고 애니메이션 시작
    const logoAnimation = () => {
      const startTime = performance.now();
      const duration = 1000; // 1초

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out 효과 적용
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setLogoOpacity(easeOut);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // 로고 애니메이션 시작
    setTimeout(() => {
      logoAnimation();
    }, 500);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  /**
   * 표지 페이지 애니메이션 시작 함수
   */
  const startCoverPageAnimation = () => {
    // 애니메이션 상태 초기화
    resetAnimationStates();
  };

  /**
   * 애니메이션 상태 초기화 함수
   */
  const resetAnimationStates = () => {
    // 기존 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  /**
   * 홈 버튼 클릭 핸들러 - FrienderPage 재시작 또는 뒤로 가기
   */
  const handleHomeClick = () => {
    // onBack이 있으면 뒤로 가기, 없으면 FrienderPage 재시작
    if (onBack) {
      onBack();
      return;
    }

    // 상태 초기화
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);
    setImageScale(1.2);
    setImageOpacity(0);

    // 로고 애니메이션 재시작
    setTimeout(() => {
      const logoAnimation = () => {
        const startTime = performance.now();
        const duration = 1000;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const easeOut = 1 - Math.pow(1 - progress, 3);
          setLogoOpacity(easeOut);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      // 로고 애니메이션 시작
      logoAnimation();
    }, 500);
  };

  /**
   * 프린터 버튼 클릭 핸들러 - PDF를 열고 프린트
   */
  const handlePrintClick = () => {
    const pdfUrl = getPdfPath(currentLanguage);
    const pdfWindow = window.open(pdfUrl, "_blank");
    if (pdfWindow) {
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    }
  };

  /**
   * PDF 다운로드 버튼 클릭 핸들러
   */
  const handleDownloadClick = () => {
    const pdfPath = getPdfPath(currentLanguage);
    const pdfFilenameMap = {
      ko: '프랜더-카탈로그.pdf',
      en: 'Friender-Catalog.pdf',
      ja: 'Friender-カタログ.pdf',
      zh: 'Friender-目录.pdf',
      es: 'Friender-Catalogo.pdf',
    };
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfFilenameMap[currentLanguage] || pdfFilenameMap['ko'];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Friender',
        text: '프랜더 Friender 카탈로그에 대한 설명',
        url: window.location.href,
      }).then(() => {
        // Web Share API 성공 후에도 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
        }).catch(() => {
        });
      }).catch(() => {
        // Web Share API 실패 시 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Friender 링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
          alert('클립보드 복사에 실패했습니다.');
        });
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('Friender 링크가 클립보드에 복사되었습니다!');
        })
        .catch(() => {
          alert('클립보드 복사에 실패했습니다.');
        });
    }
  };

  /**
   * 목차 버튼 클릭 핸들러
   */
  const handleTocClick = () => {
    const targetPage = document.querySelector('[data-page-index="0"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * 3D 모델 뷰어 토글 핸들러 (표지 페이지에서만 작동)
   */
  const handle3DModelToggle = () => {
    setShow3DModel(!show3DModel);
  };

  /**
   * 영역별 클릭 핸들러들
   */
  const handleArea1Click = () => {
    // 1번 영역: 3번 페이지로 스크롤
    const targetPage = document.querySelector('[data-page-index="2"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea2Click = () => {
    // 2번 영역: 4번 페이지로 스크롤 (1페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="3"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea3Click = () => {
    // 3번 영역: 5번 페이지로 스크롤 (1페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="4"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea4Click = () => {
    // 4번 영역: 6번 페이지로 스크롤 (2페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="5"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea5Click = () => {
    // 5번 영역: 유튜브 링크 새 탭에서 열기
    window.open(
      'https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos',
      '_blank'
    );
  };

  /**
   * 영역의 팝업 타입 자동 감지 (실제 모달 내용 기준)
   */
  const detectPopupType = useCallback((area) => {
    // data-tutorial-popup-type 속성이 있으면 우선 사용
    const manualType = area.getAttribute('data-tutorial-popup-type');
    if (manualType) {
      return manualType;
    }

    // title 속성에서 페이지와 영역 번호 추출
    const title = area.getAttribute('title') || '';
    const pageMatch = title.match(/(\d+)-(\d+)/);
    
    if (pageMatch) {
      const pageNum = parseInt(pageMatch[1]);
      const areaNum = parseInt(pageMatch[2]);
      
      // 페이지별 타입 매핑 (실제 모달 내용 기준)
      if (pageNum === 2) {
        return 'zoom';
      } else if (pageNum === 3) {
        return 'zoom';
      } else if (pageNum === 4) {
        if (title.includes('4-1-img')) {
          return 'video-list';
        } else if (title.includes('-img')) {
          return 'image';
        } else if (areaNum === 1 || areaNum === 2) {
          return 'zoom';
        } else {
          return 'image';
        }
      } else if (pageNum === 5) {
        if (title.includes('-img')) {
          return 'image';
        } else if (areaNum === 1 || areaNum === 2) {
          return 'zoom';
        } else {
          return 'image';
        }
      } else if (pageNum === 6) {
        if (title.includes('6-3-img')) {
          return '3d';
        } else if (title.includes('6-1-img') || title.includes('6-2-img')) {
          return 'video';
        } else if (areaNum >= 1 && areaNum <= 4) {
          return 'zoom';
        }
      } else if (pageNum === 7) {
        if (title.includes('7-1-img') || title.includes('7-2-img') || title.includes('7-3-img')) {
          return 'video';
        } else if (areaNum >= 1 && areaNum <= 4) {
          return 'zoom';
        }
      } else if (pageNum === 8) {
        if (title.includes('-img')) {
          return 'image';
        } else if (areaNum >= 1 && areaNum <= 3) {
          return 'zoom';
        } else {
          return 'image';
        }
      } else if (pageNum === 9) {
        return 'zoom';
      } else if (pageNum === 10) {
        if (areaNum === 1 || areaNum === 2) {
          return 'zoom';
        } else if (areaNum === 3 || areaNum === 4 || areaNum === 5 || areaNum === 6) {
          return 'image';
        }
      } else if (pageNum === 11) {
        return 'zoom';
      }
    }

    return 'zoom';
  }, []);

  /**
   * 팝업 타입별 제목과 설명 반환
   */
  const getPopupTypeInfo = useCallback((popupType) => {
    const typeMap = {
      'zoom': {
        title: t('tooltipZoomPopupTitle'),
        description: t('tooltipZoomPopupDesc'),
      },
      'image': {
        title: t('tooltipImagePopupTitle'),
        description: t('tooltipImagePopupDesc'),
      },
      'video-list': {
        title: t('tooltipVideoListPopupTitle'),
        description: t('tooltipVideoListPopupDesc'),
      },
      'video': {
        title: t('tooltipVideoPopupTitle'),
        description: t('tooltipVideoPopupDesc'),
      },
      '3d': {
        title: t('tooltip3DPopupTitle'),
        description: t('tooltip3DPopupDesc'),
      },
    };
    return typeMap[popupType] || {
      title: t('tooltipInfoPopupTitle'),
      description: t('tooltipInfoPopupDesc'),
    };
  }, [t]);

  /**
   * 툴바 버튼별 툴팁 정보 반환
   */
  const getToolbarButtonInfo = useCallback((buttonType) => {
    const buttonMap = {
      'home': {
        title: t('tooltipHomeTitle'),
        description: t('tooltipHomeDesc'),
      },
      'print': {
        title: t('tooltipPrintTitle'),
        description: t('tooltipPrintDesc'),
      },
      'download': {
        title: t('tooltipDownloadTitle'),
        description: t('tooltipDownloadDesc'),
      },
      'share': {
        title: t('tooltipShareTitle'),
        description: t('tooltipShareDesc'),
      },
      'language': {
        title: t('tooltipLanguageTitle'),
        description: t('tooltipLanguageDesc'),
      },
    };
    return buttonMap[buttonType] || {
      title: t('tooltipButtonDefaultTitle'),
      description: t('tooltipButtonDefaultDesc'),
    };
  }, [t]);

  /**
   * 튜토리얼 모드에서 영역 터치 핸들러 (모바일 전용)
   */
  const handleTutorialAreaTouch = useCallback((event, areaElement, onClickHandler) => {
    if (!isTutorialMode) {
      onClickHandler();
      return;
    }

    const areaId = areaElement.getAttribute('data-area-id') || 
                   areaElement.getAttribute('title') || 
                   `${Date.now()}-${Math.random()}`;
    
    // 툴팁이 이미 표시되었는지 확인
    if (tutorialTooltipShown.has(areaId)) {
      // 두 번째 터치: 팝업 열기
      setTutorialTooltip(null);
      onClickHandler();
    } else {
      // 첫 번째 터치: 툴팁 표시
      const rect = areaElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const isTopHalf = centerY < viewportHeight / 2;
      const direction = isTopHalf ? 'bottom' : 'top';
      
      const popupType = detectPopupType(areaElement);
      const typeInfo = getPopupTypeInfo(popupType);
      
      setTutorialTooltip({
        title: typeInfo.title,
        description: typeInfo.description,
      });
      
      setTutorialTooltipPosition({
        x: centerX,
        y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
      });
      
      setTutorialTooltipDirection(direction);
      
      // 툴팁 표시 상태에 추가
      setTutorialTooltipShown(prev => new Set(prev).add(areaId));
    }
  }, [isTutorialMode, tutorialTooltipShown, detectPopupType, getPopupTypeInfo]);

  /**
   * 3페이지 영역 클릭 핸들러
   */
  const handlePage3AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage3ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page3-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setModalZoomLevel(1);
        setIsModalZoomed(false);
        setModalDragOffset({ x: 0, y: 0 });
        setIsModalDragging(false);
        modalDragStartRef.current = { x: 0, y: 0 };
        setSelectedPage3Area(areaNumber);
        setIsPage3ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return; // 튜토리얼 모드에서는 여기서 종료
    }

    // 튜토리얼 모드가 아닐 때만 팝업 열기
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };

    setSelectedPage3Area(areaNumber);
    setIsPage3ModalOpen(true);
  };

  /**
   * 3페이지 모달 닫기 핸들러
   */
  const closePage3Modal = () => {
    setIsPage3ModalOpen(false);
    setSelectedPage3Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 5페이지로 이동하는 핸들러
   */
  const handleGoToPage5 = () => {
    // 모달 닫기
    closeModal();
    // 5페이지로 스크롤 이동 (페이지 인덱스는 0부터 시작하므로 4)
    const targetPage = document.querySelector('[data-page-index="4"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * 모달 닫기 핸들러
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  /**
   * 추가 모달 닫기 핸들러
   */
  const closeAdditionalModal = () => {
    setIsAdditionalModalOpen(false);
    setSelectedAdditionalArea(null);
  };

  /**
   * 이미지 모달 열기 핸들러
   */
  const openImageModal = (imageType) => {
    setSelectedImageType(imageType);
    setIsImageModalOpen(true);
  };

  // 추가 영역 이미지 모달 열기/닫기 (돋보기 컨트롤 없이)
  const openAdditionalImageModal = (imageType) => {
    setSelectedAdditionalImageType(imageType);
    setIsAdditionalImageModalOpen(true);
  };
  const closeAdditionalImageModal = () => {
    setIsAdditionalImageModalOpen(false);
    setSelectedAdditionalImageType(null);
  };

  /**
   * 이미지 모달 닫기 핸들러
   */
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageType(null);
  };

  /**
   * 4페이지 영역 클릭 핸들러
   */
  const handlePage4AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage4ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page4-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage4Area(areaNumber);
        setIsPage4ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage4Area(areaNumber);
    setIsPage4ModalOpen(true);
  };

  /**
   * 4페이지 모달 닫기 핸들러
   */
  const closePage4Modal = () => {
    setIsPage4ModalOpen(false);
    setSelectedPage4Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 4페이지 영역 2번 전용 모달 열기 핸들러 (테스트용)
   */
  const handlePage4Area2Click = () => {
    setIsPage4Area2ModalOpen(true);
  };

  /**
   * 4페이지 영역 2번 전용 모달 닫기 핸들러 (테스트용)
   */
  const closePage4Area2Modal = () => {
    setIsPage4Area2ModalOpen(false);
  };

  /**
   * 5페이지 영역 클릭 핸들러
   */
  const handlePage5AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage5ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page5-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage5Area(areaNumber);
        setIsPage5ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage5Area(areaNumber);
    setIsPage5ModalOpen(true);
  };

  /**
   * 5페이지 3D 모델 파트 클릭 핸들러
   */
  const handlePage5PartClick = (partNumber) => {
    setSelectedPart(partNumber);
    setIsPage53DModelLoading(true); // 파트 변경 시 로딩 상태 시작

    // 파트별 모델 경로 설정
    setCurrentPartModel('/FrienderFile/3DModel/Drone.glb');

    // 모달 새로고침을 위한 키 증가
    setModalKey((prev) => prev + 1);
  };

  /**
   * 5페이지 모달 닫기 핸들러
   */
  const closePage5Modal = () => {
    setIsPage5ModalOpen(false);
    setSelectedPage5Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 5페이지 외장재 모달 닫기 핸들러
   */
  const closePage5ExteriorModal = () => {
    setIsPage5ExteriorModalOpen(false);
    setSelectedExteriorType(null);
  };

  /**
   * 6페이지 영역 클릭 핸들러
   */
  const handlePage6AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage6ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page6-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        // areaNumber에 따라 파일명 결정
        if (areaNumber === 7) {
          setIsPage63DModalOpen(true);
        } else {
          setSelectedPage6Area(areaNumber);
          setIsPage6ModalOpen(true);
        }
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    // areaNumber에 따라 파일명 결정
    if (areaNumber === 7) {
      setIsPage63DModalOpen(true);
    } else {
      setSelectedPage6Area(areaNumber);
      setIsPage6ModalOpen(true);
    }
  };

  /**
   * 6페이지 모달 닫기 핸들러
   */
  const closePage6Modal = () => {
    setIsPage6ModalOpen(false);
    setSelectedPage6Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 6페이지 3D 모델 모달 닫기 핸들러
   */
  const closePage63DModal = () => {
    setIsPage63DModalOpen(false);
  };

  /**
   * 2페이지 영역 클릭 핸들러
   */
  const handlePage2AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage2ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page2-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage2Area(areaNumber);
        setIsPage2ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return; // 튜토리얼 모드에서는 여기서 종료
    }

    // 튜토리얼 모드가 아닐 때만 팝업 열기
    setSelectedPage2Area(areaNumber);
    setIsPage2ModalOpen(true);
  };

  /**
   * 2페이지 모달 닫기 핸들러
   */
  const closePage2Modal = (event) => {
    setIsPage2ModalOpen(false);
    setSelectedPage2Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 7페이지 영역 클릭 핸들러
   */
  const handlePage7AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage7ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page7-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage7Area(areaNumber);
        setIsPage7ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage7Area(areaNumber);
    setIsPage7ModalOpen(true);
  };

  /**
   * 7페이지 모달 닫기 핸들러
   */
  const closePage7Modal = () => {
    setIsPage7ModalOpen(false);
    setSelectedPage7Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 8페이지 영역 클릭 핸들러
   */
  const handlePage8AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage8ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page8-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage8Area(areaNumber);
        setIsPage8ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage8Area(areaNumber);
    setIsPage8ModalOpen(true);
  };

  /**
   * 8페이지 모달 닫기 핸들러
   */
  const closePage8Modal = () => {
    setIsPage8ModalOpen(false);
    setSelectedPage8Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 9페이지 영역 클릭 핸들러
   */
  const handlePage9AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage9ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page9-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage9Area(areaNumber);
        setIsPage9ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage9Area(areaNumber);
    setIsPage9ModalOpen(true);
  };

  /**
   * 9페이지 모달 닫기 핸들러
   */
  const closePage9Modal = () => {
    setIsPage9ModalOpen(false);
    setSelectedPage9Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 10페이지 영역 클릭 핸들러
   */
  const handlePage10AreaClick = (areaNumber, event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage10ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = `page10-area${areaNumber}`;
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setSelectedPage10Area(areaNumber);
        setIsPage10ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setSelectedPage10Area(areaNumber);
    setIsPage10ModalOpen(true);
  };

  /**
   * 10페이지 모달 닫기 핸들러
   */
  const closePage10Modal = () => {
    setIsPage10ModalOpen(false);
    setSelectedPage10Area(null);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 11페이지 영역 클릭 핸들러
   */
  const handlePage11AreaClick = (event) => {
    // 모달이 방금 닫힌 경우 영역 클릭 무시
    if (isPage11ModalJustClosed) {
      return;
    }

    // 튜토리얼 모드 처리
    if (isTutorialMode && event?.currentTarget) {
      const areaId = 'page11-area1';
      if (tutorialTooltipShown.has(areaId)) {
        // 두 번째 터치: 팝업 열기
        setTutorialTooltip(null);
        setTutorialTooltipShown(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaId);
          return newSet;
        });
        setIsPage11ModalOpen(true);
      } else {
        // 첫 번째 터치: 툴팁 표시만 (팝업 열지 않음)
        const areaElement = event.currentTarget;
        const rect = areaElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const isTopHalf = centerY < viewportHeight / 2;
        const direction = isTopHalf ? 'bottom' : 'top';
        
        const popupType = detectPopupType(areaElement);
        const typeInfo = getPopupTypeInfo(popupType);
        
        setTutorialTooltip({
          title: typeInfo.title,
          description: typeInfo.description,
        });
        
        setTutorialTooltipPosition({
          x: centerX,
          y: isTopHalf ? rect.bottom + 10 : rect.top - 10,
        });
        
        setTutorialTooltipDirection(direction);
        setTutorialTooltipShown(prev => new Set(prev).add(areaId));
      }
      return;
    }

    setIsPage11ModalOpen(true);
  };

  /**
   * 11페이지 모달 닫기 핸들러
   */
  const closePage11Modal = () => {
    setIsPage11ModalOpen(false);
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 모달 확대 핸들러
   */
  const handleModalZoomIn = () => {
    setModalZoomLevel((prev) => Math.min(prev + 0.2, 3));
    setIsModalZoomed(true);
  };

  /**
   * 모달 축소 핸들러
   */
  const handleModalZoomOut = () => {
    setModalZoomLevel((prev) => {
      const newLevel = Math.max(prev - 0.2, 0.5);
      if (newLevel === 1) {
        setIsModalZoomed(false);
      }
      return newLevel;
    });
  };

  /**
   * 모달 확대/축소 리셋 핸들러
   */
  const handleModalZoomReset = () => {
    setModalZoomLevel(1);
    setIsModalZoomed(false);
  };

  /**
   * 모달 드래그 시작 핸들러
   */
  const handleModalDragStart = (e) => {
    setIsModalDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    modalDragStartRef.current = {
      x: e.clientX - rect.left - modalDragOffset.x,
      y: e.clientY - rect.top - modalDragOffset.y,
    };
  };

  /**
   * 모달 드래그 이동 핸들러
   */
  const handleModalDragMove = (e) => {
    if (isModalDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - rect.left - modalDragStartRef.current.x;
      const newY = e.clientY - rect.top - modalDragStartRef.current.y;
      setModalDragOffset({ x: newX, y: newY });
    }
  };

  /**
   * 모달 드래그 종료 핸들러
   */
  const handleModalDragEnd = () => {
    setIsModalDragging(false);
  };

  /**
   * 모달 위치 리셋 핸들러
   */
  const handleModalPositionReset = () => {
    setModalDragOffset({ x: 0, y: 0 });
  };

  /**
   * 영상 닫기 핸들러 (주석 처리)
   */
  // const closeVideo = () => {
  //   setShowVideo(false);
  // };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 인트로 화면 (흰 화면 + 로고) */}
      {showIntro && (
        <div
          className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-out ${
            whiteScreenVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Friender 로고 */}
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img 
              src="/FrienderFile/Interactive/Friender-Logo-L.png"
              alt="Friender Logo"
              className="max-w-full max-h-full object-contain"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      )}

      {/* 본 화면 */}
      {mainScreenVisible && (
        <div className="w-full h-full relative bg-white flex flex-col">
          {/* 스크롤 컨테이너 - Book.jsx 방식 적용 */}
          <div className="flex-1 overflow-y-auto pb-20">
            {/* 페이지들을 세로로 배치 */}
            <div className="w-full space-y-0">
              {pageImages.map((page, index) => (
                <div
                  key={page.id}
                  className="relative overflow-hidden bg-white"
                  data-page-index={index}
                  style={{
                    width: '100%',
                    height: 'auto',
                    minHeight: 'auto',
                    aspectRatio: 'auto',
                  }}
                >
                  <div className="w-full h-full flex flex-col justify-center items-center text-center relative">
                    {/* 모든 페이지 배경 이미지 */}
                    <img
                      src={page.backgroundImage}
                      alt={page.name}
                      className="w-full h-full object-cover"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* 표지 페이지 특별 처리 */}
                    {index === 0 && (
                      <>
                        {/* front.gif 전체 사이즈 배치 */}
                        {showFrontGif && (
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src={getFrontGifPath(currentLanguage)}
                              alt="Front Animation"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* 2번째 페이지 클릭 영역들 */}
                    {index === 1 && (
                      <>
                        {/* 2페이지 영역 6개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '16%',
                            left: '7%',
                            width: '50%',
                            height: '11%',
                          }}
                          data-clickable="true"
                          onTouchStart={(e) => {
                            // 모달이 방금 닫힌 경우 터치 무시
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            // 모달이 방금 닫힌 경우 클릭 무시
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '23%',
                            left: '7%',
                            width: '28%',
                            height: '17%',
                          }}
                          data-clickable="true"
                          data-area-id="page2-area2"
                          onTouchStart={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '23%',
                            left: '38%',
                            width: '28%',
                            height: '17%',
                          }}
                          data-clickable="true"
                          data-area-id="page2-area3"
                          onTouchStart={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-3')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '4%',
                            left: '5%',
                            width: '28%',
                            height: '17%',
                          }}
                          data-clickable="true"
                          data-area-id="page2-area4"
                          onTouchStart={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-4')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '4%',
                            left: '39%',
                            width: '25%',
                            height: '16%',
                          }}
                          data-clickable="true"
                          data-area-id="page2-area5"
                          onTouchStart={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-5')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '3%',
                            right: '4%',
                            width: '21%',
                            height: '41%',
                          }}
                          data-clickable="true"
                          data-area-id="page2-area6"
                          onTouchStart={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage2ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage2AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '2-6')}
                        >
                        </div>
                      </>
                    )}

                    {/* 3번째 페이지 클릭 영역들 */}
                    {index === 2 && (
                      <>
                        {/* 3페이지 영역 5개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        {/* 3-1.jpg */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPage3ModalOpen ||
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '30%',
                            left: '7%',
                            width: '24%',
                            height: '25%',
                          }}
                          data-area-id="page3-area1"
                          onTouchStart={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage3AreaClick(1, e);
                          }}
                        ></div>

                        {/* 3-2.jpg */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPage3ModalOpen ||
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '30%',
                            left: '32%',
                            width: '24%',
                            height: '25%',
                          }}
                          onTouchStart={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(2, e);
                          }}
                          data-area-id="page3-area2"
                          onClick={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(2, e);
                          }}
                        ></div>

                        {/* 3-3.png */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPage3ModalOpen ||
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '14%',
                            left: '6%',
                            width: '25%',
                            height: '26%',
                          }}
                          onTouchStart={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(3, e);
                          }}
                          data-area-id="page3-area3"
                          onClick={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(3, e);
                          }}
                        ></div>

                        {/* 3-4.jpg */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPage3ModalOpen ||
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '14%',
                            left: '32%',
                            width: '24%',
                            height: '26%',
                          }}
                          onTouchStart={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(4, e);
                          }}
                          data-area-id="page3-area4"
                          onClick={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(4, e);
                          }}
                        ></div>

                        {/* 3-5.jpg */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPage3ModalOpen ||
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '15%',
                            right: '6%',
                            width: '29%',
                            height: '25%',
                          }}
                          onTouchStart={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(5, e);
                          }}
                          data-area-id="page3-area5"
                          onClick={(e) => {
                            if (isPage3ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage3AreaClick(5, e);
                          }}
                        ></div>
                      </>
                    )}

                    {/* 4번째 페이지 클릭 영역들 */}
                    {index === 3 && (
                      <>
                        {/* 4페이지 영역 6개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '10%',
                            left: '17%',
                            width: '74%',
                            height: '23%',
                          }}
                          data-clickable="true"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage4AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '24%',
                            left: '17%',
                            width: '74%',
                            height: '20%',
                          }}
                          data-clickable="true"
                          data-area-id="page4-area2"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '33%',
                            left: '18%',
                            width: '37%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page4-area3"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-1-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '33%',
                            right: '5%',
                            width: '37%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page4-area4"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-2-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '4%',
                            left: '18%',
                            width: '37%',
                            height: '20%',
                          }}
                          data-clickable="true"
                          data-area-id="page4-area5"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-3-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '4%',
                            right: '5%',
                            width: '37%',
                            height: '20%',
                          }}
                          data-clickable="true"
                          data-area-id="page4-area6"
                          onTouchStart={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage4ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage4AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '4-4-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 5번째 페이지 클릭 영역들 */}
                    {index === 4 && (
                      <>
                        {/* 5페이지 영역 6개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '10%',
                            left: '5%',
                            width: '74%',
                            height: '22%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area1"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '23%',
                            left: '5%',
                            width: '74%',
                            height: '21%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area2"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-2')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '33%',
                            left: '5%',
                            width: '37%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area3"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-1-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '33%',
                            right: '18%',
                            width: '37%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area4"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-2-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '5%',
                            left: '5%',
                            width: '37%',
                            height: '18%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area5"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-3-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '5%',
                            right: '18%',
                            width: '37%',
                            height: '18%',
                          }}
                          data-clickable="true"
                          data-area-id="page5-area6"
                          onTouchStart={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage5AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage5ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage5AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '5-4-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 6번째 페이지 클릭 영역들 */}
                    {index === 5 && (
                      <>
                        {/* 6페이지 영역 7개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '20%',
                            left: '6%',
                            width: '82%',
                            height: '9%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area1"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '31%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area2"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '52%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area3"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-3')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '8%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area4"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-4')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '31%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area5"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-1-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '52%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area6"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-2-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '8%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page6-area7"
                          onTouchStart={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage6AreaClick(7, e);
                          }}
                          onClick={(e) => {
                            if (isPage6ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage6AreaClick(7, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '6-3-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 7번째 페이지 클릭 영역들 */}
                    {index === 6 && (
                      <>
                        {/* 7페이지 영역 7개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '20%',
                            left: '6%',
                            width: '82%',
                            height: '9%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area1"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '31%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area2"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '52%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area3"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-3')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '8%',
                            right: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area4"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-4')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '31%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area5"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-1-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '52%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area6"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-2-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '8%',
                            left: '6%',
                            width: '43%',
                            height: '19%',
                          }}
                          data-clickable="true"
                          data-area-id="page7-area7"
                          onTouchStart={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage7AreaClick(7, e);
                          }}
                          onClick={(e) => {
                            if (isPage7ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage7AreaClick(7, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '7-3-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 8번째 페이지 클릭 영역들 */}
                    {index === 7 && (
                      <>
                        {/* 8페이지 영역 4개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '26%',
                            left: '6%',
                            width: '43%',
                            height: '21%',
                          }}
                          data-clickable="true"
                          data-area-id="page8-area1"
                          onTouchStart={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage8AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage8AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '8-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '5%',
                            left: '6%',
                            width: '43%',
                            height: '21%',
                          }}
                          data-clickable="true"
                          data-area-id="page8-area2"
                          onTouchStart={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage8AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage8AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '8-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '5%',
                            right: '6%',
                            width: '43%',
                            height: '21%',
                          }}
                          data-clickable="true"
                          data-area-id="page8-area3"
                          onTouchStart={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage8AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage8AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '8-3')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '14%',
                            right: '6%',
                            width: '40%',
                            height: '35%',
                          }}
                          data-clickable="true"
                          data-area-id="page8-area4"
                          onTouchStart={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage8AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage8ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage8AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '8-1-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 9번째 페이지 클릭 영역들 */}
                    {index === 8 && (
                      <>
                        {/* 9페이지 영역 4개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '13%',
                            left: '6%',
                            width: '80%',
                            height: '10%',
                          }}
                          data-clickable="true"
                          data-area-id="page9-area1"
                          onTouchStart={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage9AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage9AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '9-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '24%',
                            left: '6%',
                            width: '87%',
                            height: '26%',
                          }}
                          data-clickable="true"
                          data-area-id="page9-area2"
                          onTouchStart={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage9AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage9AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '9-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '53%',
                            left: '6%',
                            width: '80%',
                            height: '18%',
                          }}
                          data-clickable="true"
                          data-area-id="page9-area3"
                          onTouchStart={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage9AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage9AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '9-3')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '74%',
                            left: '6%',
                            width: '80%',
                            height: '21%',
                          }}
                          data-clickable="true"
                          data-area-id="page9-area4"
                          onTouchStart={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage9AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage9ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage9AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '9-4')}
                        >
                        </div>
                      </>
                    )}

                    {/* 10번째 페이지 클릭 영역들 */}
                    {index === 9 && (
                      <>
                        {/* 10페이지 영역 6개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '13%',
                            left: '6%',
                            width: '80%',
                            height: '10%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area1"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(1, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(1, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-1')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '28%',
                            left: '6%',
                            width: '80%',
                            height: '17%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area2"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(2, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(2, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-2')}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '5%',
                            width: '45%',
                            height: '22%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area3"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(3, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(3, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-1-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '5%',
                            width: '45%',
                            height: '22%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area4"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(4, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(4, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-2-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '6%',
                            left: '5%',
                            width: '45%',
                            height: '22%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area5"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(5, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(5, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-3-img')}
                        >
                        </div>

                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '6%',
                            right: '5%',
                            width: '45%',
                            height: '22%',
                          }}
                          data-clickable="true"
                          data-area-id="page10-area6"
                          onTouchStart={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage10AreaClick(6, e);
                          }}
                          onClick={(e) => {
                            if (isPage10ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage10AreaClick(6, e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '10-4-img')}
                        >
                        </div>
                      </>
                    )}

                    {/* 11번째 페이지 클릭 영역들 */}
                    {index === 10 && (
                      <>
                        {/* 11페이지 영역 1개 배치 - FrienderPage.jsx와 동일한 위치 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isModalOpen ||
                            isAdditionalModalOpen ||
                            isPage4ModalOpen ||
                            isPage4Area2ModalOpen ||
                            isPage5ModalOpen ||
                            isPage53DModalOpen ||
                            isPage6ModalOpen ||
                            isPage63DModalOpen ||
                            is3DModalOpen ||
                            isImageModalOpen ||
                            isPage5ExteriorModalOpen ||
                            isPage2ModalOpen ||
                            isPage7ModalOpen ||
                            isPage8ModalOpen ||
                            isPage9ModalOpen ||
                            isPage10ModalOpen ||
                            isPage11ModalOpen
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          style={{
                            position: 'absolute',
                            bottom: '30%',
                            right: '25%',
                            width: '35%',
                            height: '30%',
                          }}
                          data-clickable="true"
                          data-area-id="page11-area1"
                          onTouchStart={(e) => {
                            if (isPage11ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            e.stopPropagation();
                            handlePage11AreaClick(e);
                          }}
                          onClick={(e) => {
                            if (isPage11ModalJustClosed) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            handlePage11AreaClick(e);
                          }}
                          title={t('popupWithNumber').replace('{number}', '11-1')}
                        >
                        </div>
                      </>
                    )}

                    {/* 페이지 그림자 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 기능 탭 - 가로 배치 */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-gray-800 p-3">
            <div className="flex justify-center items-center gap-4">
              {/* 홈 버튼 */}
              <button
                onClick={handleHomeClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title={t('home')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </button>

              {/* 프린터 버튼 */}
              <button
                onClick={handlePrintClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title={t('print')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>

              {/* PDF 다운로드 버튼 */}
              <button
                onClick={handleDownloadClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title={t('download')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>

              {/* 목차 버튼 숨김 처리 */}
              {/* <button
              {/* 목차 버튼 숨김 처리 */}
              {/* <button
                onClick={handleTocClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title={t('toc')}
                title={t('toc')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button> */}

              {/* 공유 버튼 */}
              <button
                onClick={handleShareClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title={t('share')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>

              {/* 튜토리얼 모드 버튼 */}
              <button
                onClick={() => {
                  const newMode = !isTutorialMode;
                  setIsTutorialMode(newMode);
                  if (!newMode) {
                    setTutorialTooltip(null);
                    setTutorialTooltipShown(new Set());
                  }
                }}
                className={`w-10 h-10 flex items-center justify-center rounded transition-colors duration-300 cursor-pointer ${
                  isTutorialMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-white hover:text-gray-300 hover:bg-gray-700'
                }`}
                title={isTutorialMode ? t('tooltipTutorialTitle') || '튜토리얼 모드 종료' : t('tooltipTutorialTitle') || '튜토리얼 모드 시작'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* 언어 선택 버튼 */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                  title={t('language')}
                >
                  <img 
                    src="/FrienderFile/Interactive/Language.png" 
                    alt={t('language')} 
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </button>
                
                {/* 언어 선택 드롭다운 (위로 열림) */}
                {isLanguageDropdownOpen && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-50">
                    {languageList.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                          currentLanguage === lang.code ? 'bg-gray-100 font-semibold' : ''
                        }`}
                      >
                        <span className="text-gray-800">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3페이지 모달 */}
      {isModalOpen && selectedArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closeModal();
            } else {
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center relative">
              <img
                src={getPopupPath(currentLanguage, `3-${selectedArea}.jpg`)}
                alt={`영역 ${selectedArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />

              {/* 4번째 영역에 추가 영역 배치 */}
              {selectedArea === 4 && (
                <div
                  className={`absolute cursor-pointer rounded-lg z-10`}
                  style={{
                    top: '32%',
                    left: '14.5%',
                    width: '24%',
                    height: '64%',
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageModal('3-4-1');
                  }}
                  title="3-4-1, 3-4-2 이미지 보기"
                ></div>
              )}

              {/* 6번째 영역에 추가 영역 배치 */}
              {selectedArea === 6 && (
                <div
                  className={`absolute cursor-pointer rounded-lg z-10`}
                  style={{
                    bottom: '12%',
                    left: '12%',
                    width: '22%',
                    height: '55%',
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageModal('3-6-1');
                  }}
                  title="3-6-1 이미지 보기"
                ></div>
              )}

              {/* 3번째 영역일 때 블랙페이싱 3D 모델 영역 추가 */}
              {selectedArea === 3 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* 블랙페이싱 3D 모델 영역 */}
                    <div
                      className="absolute"
                      style={{
                        top: '31%',
                        right: '6%',
                        width: '30%',
                        height: '16%',
                      }}
                    >
                      <Frender3DModel language={currentLanguage} 
                        isVisible={true} 
                        opacity={1}
                        scale={1}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/FrienderFile/3DModel/Drone.glb"
                        isModal={true}
                        cameraPosition={[4, 4, 8]}
                        cameraFov={5}
                        customScale={0.7}
                        rotateSpeed={1.0}
                        showWireframe={false}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5페이지로 이동하는 클릭 영역 - 첫 번째 영역에서만 표시 */}
              {selectedArea === 1 && (
                <div
                  className={`absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg ${
                    isAdditionalModalOpen ||
                    isPage4ModalOpen ||
                    isPage4Area2ModalOpen ||
                    isPage5ModalOpen ||
                    isPage53DModalOpen ||
                    isPage6ModalOpen ||
                    isPage63DModalOpen ||
                    is3DModalOpen ||
                    isImageModalOpen ||
                    isPage5ExteriorModalOpen ||
                    showVideo
                      ? 'pointer-events-none'
                      : ''
                  }`}
                  style={{
                    top: '49%',
                    left: '7%',
                    width: '34%',
                    height: '26%',
                    zIndex: 1,
                  }}
                  onClick={(e) => {
                    handleGoToPage5();
                  }}
                  title="5페이지로 이동"
                ></div>
              )}
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/3-{selectedArea}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 4개 영역 모달 */}
      {isAdditionalModalOpen && selectedAdditionalArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closeAdditionalModal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeAdditionalModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, `3-${selectedAdditionalArea}.jpg`)}
                alt={`영역 ${selectedAdditionalArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />

              {/* 3D 모델 영역 - 각 영역마다 다른 모델 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {selectedAdditionalArea === 7 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                      <Frender3DModel language={currentLanguage} 
                        isVisible={true} 
                        opacity={1}
                        scale={1}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/FrienderFile/3DModel/Drone.glb"
                        isModal={true}
                        cameraPosition={[8, 14, 14]}
                        cameraFov={20}
                        customScale={1}
                      />
                    </div>
                  )}

                  {selectedAdditionalArea === 8 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Frender3DModel language={currentLanguage} 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/FrienderFile/3DModel/Drone.glb"
                      isModal={true}
                      cameraPosition={[4, 3, 8]}
                      cameraFov={30}
                      customScale={0.3}
                    />
                  </div>
                  )}

                  {selectedAdditionalArea === 9 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Frender3DModel language={currentLanguage} 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/FrienderFile/3DModel/Drone.glb"
                      isModal={true}
                      cameraPosition={[-10, 10, 20]}
                      cameraFov={40}
                      customScale={0.3}
                    />
                  </div>
                  )}

                  {selectedAdditionalArea === 10 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Frender3DModel language={currentLanguage} 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/FrienderFile/3DModel/Drone.glb"
                      isModal={true}
                      cameraPosition={[1, 2, 2]}
                      cameraFov={30}
                      customScale={0.3}
                    />
                  </div>
                  )}

                  {/* 오른쪽 추가 영역 (7~10 공통) - 투명 클릭 영역 */}
                  {selectedAdditionalArea >= 7 && selectedAdditionalArea <= 10 && (
                    <div
                      className="absolute"
                      style={{ top: '18%', right: '5%', width: '19%', height: '60%' }}
                      onClick={() =>
                        openAdditionalImageModal(`pae_3-${selectedAdditionalArea - 6}`)
                      }
                    ></div>
                  )}
                </div>
              </div>
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/3-{selectedAdditionalArea}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 모달 */}
      {isPage4ModalOpen && selectedPage4Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage4Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage4Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, `4-${selectedPage4Area}.jpg`)}
                alt={`영역 ${selectedPage4Area}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/4-{selectedPage4Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 영역 2번 전용 모달 (테스트용) */}
      {isPage4Area2ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage4Area2Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage4Area2Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, '4-2.jpg')}
                alt={t('area2Test')}
                className="max-w-full min-h-[40vh] max-h-[75vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/4-2.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 모달 */}
      {isPage5ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage5Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage5Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, '5-2.jpg')}
                alt="5페이지 2번째 영역"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/5-2.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 3D 모델 모달창 */}
      {isPage53DModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setIsPage53DModalOpen(false);
              setCurrentPartModel(null);
              setSelectedPart(1);
              setIsPage53DModelLoading(false);
            }
          }}
        >
          <div
            className={`relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden ${
              currentPartModel ? 'p-0' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
            key={`3d-modal-${modalKey}-${selectedPart}`} // 모달 새로고침을 위한 키 (파트 변경 포함)
          >
            {/* 모달 헤더 - 전체 시스템일 때만 표시 */}
            {!currentPartModel && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
                <div className="flex justify-center items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    5페이지 3D 모델 뷰어 - 전체 시스템
                  </h3>
                </div>
              </div>
            )}

            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div
              className={`w-full relative ${
                !currentPartModel ? 'h-full pt-16 pb-20' : 'h-full pb-16'
              }`}
            >
              {/* 배경 이미지 - 파트 선택 시에만 표시 */}
              {currentPartModel && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={getPopupPath(currentLanguage, `5-${selectedPage5Area}.jpg`)}
                    alt={`5페이지 배경 이미지 ${selectedPart}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // JPG가 없으면 기본 이미지 사용
                      e.target.src = getPopupPath(currentLanguage, '5-2.jpg');
                    }}
                  />
                </div>
              )}

              {/* 파트 선택 안내 텍스트 */}
              {!currentPartModel && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      🎯 파트를 선택해보세요!
                    </p>
                    <p className="text-sm text-gray-600">
                      마우스로 회전하여 각 파트를 확인하고 클릭해보세요
                    </p>
                  </div>
                </div>
              )}

              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className={`z-10 w-full h-full ${currentPartModel ? 'absolute inset-0' : 'relative'}`}>
                <Frender3DModel language={currentLanguage} 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath="/FrienderFile/3DModel/Drone.glb"
                  isModal={true}
                  cameraPosition={currentPartModel ? [3, -2, 8] : [0, 0, 14]} // 파트 모델링과 system_with_panel 분리
                  cameraFov={currentPartModel ? 30 : 40}
                  customScale={0.8}
                  rotateSpeed={1.0}
                  showWireframe={!currentPartModel} // 파트 모델이 선택되면 박스 숨김
                  onPartClick={handlePage5PartClick}
                  onModelLoad={() => setIsPage53DModelLoading(false)} // 모델 로딩 완료 시 로딩 상태 해제
                />
              </div>
            </div>

            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                {currentPartModel && (
                  <p className="text-sm text-blue-600 mb-2">선택된 파트: {selectedPart}</p>
                )}
                <div className="flex justify-center space-x-4">
                  {currentPartModel && (
                    <button
                      onClick={() => {
                        setCurrentPartModel(null);
                        setSelectedPart(1);
                        setIsPage53DModelLoading(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      전체 모델로 돌아가기
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsPage53DModalOpen(false);
                      setCurrentPartModel(null);
                      setSelectedPart(1);
                      setIsPage53DModelLoading(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6페이지 모달 */}
      {isPage6ModalOpen && selectedPage6Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage6ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage6Modal();
          }}
          onTouchStart={(e) => {
            if (isPage6ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage6Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage6Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 또는 GIF 표시 */}
            <div className="flex items-center justify-center w-full">
              {page6MediaOverride ? (
                <img
                  src={page6MediaOverride.src}
                  alt={page6MediaOverride.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : selectedPage6Area && selectedPage6Area >= 1 && selectedPage6Area <= 4 ? (
                <img
                  src={getPopupPath(currentLanguage,
                    selectedPage6Area === 1 ? '6-1.jpg' :
                    selectedPage6Area === 2 ? '6-2.jpg' :
                    selectedPage6Area === 3 ? '6-3.jpg' :
                    selectedPage6Area === 4 ? '6-4.jpg' :
                    '6-1.jpg'
                  )}
                  alt={t('popupArea').replace('{area}', selectedPage6Area)}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">
                  {(() => {
                    const currentOverride = selectedPage6Area && page6MediaOverrides[selectedPage6Area] 
                      ? page6MediaOverrides[selectedPage6Area] 
                      : null;
                    return currentOverride
                      ? `${t('path')}: ${currentOverride.src}`
                      : t('popupFileNotFound').replace('{area}', selectedPage6Area);
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6페이지 3D 모델 모달창 */}
      {isPage63DModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closePage63DModal}
        >
          <div
            className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D 모델 컨테이너 */}
            <div className="w-full h-full relative">
              {/* 3D 모델 */}
              <div className="w-full h-full">
                <Frender3DModel language={currentLanguage} 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath="/FrienderFile/3DModel/Drone.glb"
                  isModal={true}
                  cameraPosition={[3, 3, 8]}
                  cameraFov={15}
                  customScale={0.5}
                  rotateSpeed={1.0}
                  showWireframe={false}
                />
              </div>
            </div>

            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <div className="flex justify-center">
                  <button
                    onClick={closePage63DModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7페이지 영상 모달 */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setShowVideo(false);
            }
          }}
        >
          <div
            className="bg-black rounded-2xl p-4 max-w-4xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 영상 표시 */}
            <div className="flex items-center justify-center">
              <video
                className="w-full h-full object-contain rounded-lg"
                controls
                autoPlay
                onEnded={() => setShowVideo(false)}
              >
                <source src="/FrienderFile/VideoFile/video.mp4" type="video/mp4" />
                영상을 재생할 수 없습니다.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* 3페이지 이미지 모달창 */}
      {isImageModalOpen && selectedImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closeImageModal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              {selectedImageType === '3-4-1' ? (
                // 3-4-1 타입일 때 두 이미지를 나란히 표시
                <div className="flex max-w-full max-h-[85vh]">
                  <img
                    src={getPopupPath(currentLanguage, '3-4.jpg')}
                    alt="3-4-2 Korean 이미지"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      // 이미지 로드 실패 시 메시지 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                </div>
              ) : (
                // 다른 타입일 때는 단일 이미지 표시
                <img
                  src={getPopupPath(currentLanguage, `${selectedImageType}.jpg`)}
                  alt={`${selectedImageType} 이미지`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/{selectedImageType}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 영역 이미지 모달창 (돋보기/줌 컨트롤 없이 단순 표시) */}
      {isAdditionalImageModalOpen && selectedAdditionalImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAdditionalImageModal();
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeAdditionalImageModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, `${selectedAdditionalImageType}.jpg`)}
                alt={`${selectedAdditionalImageType} 이미지`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/{selectedAdditionalImageType}.(png|jpg)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 외장재 모달창 */}
      {isPage5ExteriorModalOpen && selectedExteriorType && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage5ExteriorModal();
            }
          }}
        >
          <div
            className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div className="w-full h-full pb-16 relative">
              {/* 배경 이미지 - 외장재 타입에 따라 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={getPopupPath(currentLanguage, `5-${selectedExteriorType}.jpg`)}
                  alt={`외장재 타입 ${selectedExteriorType} 배경 이미지`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // JPG가 없으면 기본 이미지 사용
                    e.target.src = getPopupPath(currentLanguage, '5-2.jpg');
                    // JPG가 없으면 기본 이미지 사용
                    e.target.src = getPopupPath(currentLanguage, '5-2.jpg');
                  }}
                />
              </div>

              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className="absolute inset-0 z-10 w-full h-full">
                <Frender3DModel language={currentLanguage} 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath="/FrienderFile/3DModel/Drone.glb"
                  isModal={true}
                  cameraPosition={[3, -2, 8]}
                  cameraFov={50}
                  customScale={0.8}
                  rotateSpeed={1.0}
                  showWireframe={false}
                />
              </div>
            </div>

            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <p className="text-sm text-blue-600 mb-2">외장재 타입: {selectedExteriorType}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={closePage5ExteriorModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D 모델 모달창 */}
      {is3DModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setIs3DModalOpen(false);
            }
          }}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
              <div className="flex justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800">3D 모델 뷰어</h3>
              </div>
            </div>

            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div className="w-full h-full pt-16 pb-20">
              <Frender3DModel
                isVisible={true}
                opacity={1}
                scale={0.7}
                position={{ x: 0, y: 0 }}
                animationDelay={0}
                modelPath="/FrienderFile/3DModel/Drone.glb"
                isModal={true}
                cameraPosition={[0, 0, 14]}
                cameraFov={50}
                customScale={0.8}
                rotateSpeed={1.0}
              />
            </div>

            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <p className="text-sm text-gray-600 mb-2">{t('modelControls')}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIs3DModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2페이지 모달 */}
      {isPage2ModalOpen && selectedPage2Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {

            // 모달이 방금 열린 경우 배경 클릭 무시
            if (isPage2ModalJustOpened) {
              return;
            }

            if (e.target === e.currentTarget) {
              closePage2Modal(e);
            } else {
            }
          }}
          onTouchStart={(e) => {

            // 모달이 방금 열린 경우 배경 터치 무시
            if (isPage2ModalJustOpened) {
              e.stopPropagation();
              return;
            }

            if (e.target === e.currentTarget) {
              e.stopPropagation();
              // preventDefault 제거 (passive event listener 경고 방지)
              closePage2Modal(e);
            } else {
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage2Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, `2-${selectedPage2Area}.jpg`)}
                alt={t('popupWithNumber').replace('{number}', `2-${selectedPage2Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/2-{selectedPage2Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3페이지 모달 */}
      {isPage3ModalOpen && selectedPage3Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage3ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage3Modal();
          }}
          onTouchStart={(e) => {
            if (isPage3ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage3Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage3Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage,
                  selectedPage3Area === 1 ? '3-1.jpg' :
                  selectedPage3Area === 2 ? '3-2.jpg' :
                  selectedPage3Area === 3 ? '3-3.jpg' :
                  selectedPage3Area === 4 ? '3-4.jpg' :
                  selectedPage3Area === 5 ? '3-5.jpg' :
                  '3-1.jpg'
                )}
                alt={t('popupWithNumber').replace('{number}', `3-${selectedPage3Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/3-{selectedPage3Area}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 모달 */}
      {isPage4ModalOpen && selectedPage4Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage4ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage4Modal();
          }}
          onTouchStart={(e) => {
            if (isPage4ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage4Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage4Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 콘텐츠 */}
            <div className="relative flex items-center justify-center w-full">
              {selectedPage4Area === 3 ? (
                <div className="w-full space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-semibold text-gray-900">{t('droneLearningContent')}</p>
                    <p className="text-sm text-gray-600">{t('dronePlaylistDescription')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getDroneVideoPlaylist(t).map((video, index) => {
                      const embedUrl = getYouTubeEmbedUrl(video.url);
                      return (
                        <div
                          key={video.url}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
                        >
                          {embedUrl ? (
                            <div className="relative w-full pt-[56.25%] bg-black">
                              <iframe
                                src={embedUrl}
                                title={`${index + 1}. ${video.title}`}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div className="p-6 text-center text-sm text-red-500">
                              영상을 불러올 수 없습니다.
                            </div>
                          )}

                          <div className="p-4 space-y-1 bg-gray-50">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                              {`${index + 1}. ${video.category}`}
                            </p>
                            <p className="text-base font-semibold text-gray-900">{video.title}</p>
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={getPopupPath(currentLanguage,
                      selectedPage4Area === 1 ? '4-1.jpg' :
                      selectedPage4Area === 2 ? '4-2.jpg' :
                      selectedPage4Area === 4 ? '4-1-img.jpg' :
                      selectedPage4Area === 5 ? '4-2-img.jpg' :
                      selectedPage4Area === 6 ? '4-3-img.jpg' :
                      '4-1.jpg'
                    )}
                    alt={t('popupWithNumber').replace('{number}', `4-${selectedPage4Area}`)}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      // 이미지 로드 실패 시 메시지 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  
                  <div
                    className="hidden text-gray-500 text-center"
                    style={{ display: 'none' }}
                  >
                    <p>{t('imageLoadFailed')}</p>
                    <p className="text-sm">경로: /FrienderFile/Popup/4-{selectedPage4Area}.jpg</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 모달 */}
      {isPage5ModalOpen && selectedPage5Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage5ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage5Modal();
          }}
          onTouchStart={(e) => {
            if (isPage5ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage5Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage5Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage,
                  selectedPage5Area === 1 ? '5-1.jpg' :
                  selectedPage5Area === 2 ? '5-2.jpg' :
                  selectedPage5Area === 3 ? '5-1-img.jpg' :
                  selectedPage5Area === 4 ? '5-2-img.jpg' :
                  selectedPage5Area === 5 ? '5-3-img.jpg' :
                  selectedPage5Area === 6 ? '5-4-img.jpg' :
                  '5-1.jpg'
                )}
                alt={t('popupWithNumber').replace('{number}', `5-${selectedPage5Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/5-{selectedPage5Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7페이지 모달 */}
      {isPage7ModalOpen && selectedPage7Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage7ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage7Modal();
          }}
          onTouchStart={(e) => {
            if (isPage7ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage7Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage7Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 또는 GIF 표시 */}
            <div className="flex items-center justify-center w-full">
              {page7MediaOverride ? (
                <img
                  src={page7MediaOverride.src}
                  alt={page7MediaOverride.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <img
                  src={getPopupPath(currentLanguage,
                    selectedPage7Area === 1 ? '7-1.jpg' :
                      selectedPage7Area === 2 ? '7-2.jpg' :
                        selectedPage7Area === 3 ? '7-3.jpg' :
                          selectedPage7Area === 4 ? '7-4.jpg' :
                            selectedPage7Area === 5 ? '7-1-img.jpg' :
                              selectedPage7Area === 6 ? '7-2-img.jpg' :
                                selectedPage7Area === 7 ? '7-3-img.jpg' :
                                  '7-1.jpg'
                  )}
                  alt={t('popupWithNumber').replace('{number}', `7-${selectedPage7Area}`)}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">
                  {page7MediaOverride
                    ? `${t('path')}: ${page7MediaOverride.src}`
                    : `${t('path')}: /FrienderFile/Popup/7-${selectedPage7Area}.jpg`}
                  ? `${t('path')}: ${page7MediaOverride.src}`
                  : `${t('path')}: /FrienderFile/Popup/7-${selectedPage7Area}.jpg`
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8페이지 모달 */}
      {isPage8ModalOpen && selectedPage8Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage8ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage8Modal();
          }}
          onTouchStart={(e) => {
            if (isPage8ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage8Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage8Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage,
                  selectedPage8Area === 1 ? '8-1.png' :
                  selectedPage8Area === 2 ? '8-2.png' :
                  selectedPage8Area === 3 ? '8-3.png' :
                  selectedPage8Area === 4 ? '8-1-img.jpg' :
                  '8-1.png'
                )}
                alt={t('popupWithNumber').replace('{number}', `8-${selectedPage8Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/8-{selectedPage8Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9페이지 모달 */}
      {isPage9ModalOpen && selectedPage9Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage9ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage9Modal();
          }}
          onTouchStart={(e) => {
            if (isPage9ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage9Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage9Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage, `9-${selectedPage9Area}.jpg`)}
                alt={t('popupWithNumber').replace('{number}', `9-${selectedPage9Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/9-{selectedPage9Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10페이지 모달 */}
      {isPage10ModalOpen && selectedPage10Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage10ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage10Modal();
          }}
          onTouchStart={(e) => {
            if (isPage10ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage10Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage10Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            <div className="flex items-center justify-center">
              <img
                src={getPopupPath(currentLanguage,
                  selectedPage10Area === 1 ? '10-1.jpg' :
                  selectedPage10Area === 2 ? '10-2.jpg' :
                  selectedPage10Area === 3 ? '10-1-img.jpg' :
                  selectedPage10Area === 4 ? '10-2-img.jpg' :
                  selectedPage10Area === 5 ? '10-3-img.jpg' :
                  selectedPage10Area === 6 ? '10-4-img.jpg' :
                  '10-1.jpg'
                )}
                alt={t('popupWithNumber').replace('{number}', `10-${selectedPage10Area}`)}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>{t('imageLoadFailed')}</p>
                <p className="text-sm">경로: /FrienderFile/Popup/10-{selectedPage10Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11페이지 모달 */}
      {isPage11ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (isPage11ModalJustOpened) return;
            if (e.target === e.currentTarget) closePage11Modal();
          }}
          onTouchStart={(e) => {
            if (isPage11ModalJustOpened) {
              e.stopPropagation();
              return;
            }
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closePage11Modal();
            }
          }}
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomIn')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title={t('zoomOut')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title={t('zoomReset')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            {(modalDragOffset.x !== 0 || modalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage11Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
            onTouchStart={handleModalDragStart}
            onTouchMove={isModalDragging ? handleModalDragMove : undefined}
            onTouchEnd={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 + 네이버 지도 */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={getPopupPath(currentLanguage, '11-1.jpg')}
                    alt={t('popupWithNumber').replace('{number}', '11-1')}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      // 이미지 로드 실패 시 메시지 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="hidden text-gray-500 text-center"
                    style={{ display: 'none' }}
                  >
                    <p>{t('imageLoadFailed')}</p>
                    <p className="text-sm">경로: /FrienderFile/Popup/11-1.jpg</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNaverMap();
                  }}
                  className="relative w-full min-h-[260px] h-[320px] lg:h-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gradient-to-br from-green-50 to-blue-50 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-center"
                >
                  <div className="text-center p-6">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">위치 확인하기</p>
                    <p className="text-sm text-gray-600 mb-4">{NAVER_MAP_ADDRESS}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium">
                      <span>네이버 지도에서 보기</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 text-xs text-gray-700 px-3 py-1 rounded-full shadow">
                    네이버 지도
                  </div>
                </div>

                <div className="space-y-1 text-sm leading-relaxed text-gray-700">
                  <p className="text-base font-semibold text-gray-900">주소</p>
                  <p>{NAVER_MAP_ADDRESS}</p>
                  <p className="text-xs text-gray-500">
                    위도 {NAVER_MAP_COORDINATES.lat.toFixed(6)} · 경도{' '}
                    {NAVER_MAP_COORDINATES.lng.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    지도가 보이지 않으면 아래 버튼을 눌러 새 창에서 확인해주세요.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNaverMap();
                    }}
                    className="px-5 py-2.5 rounded-full bg-green-500 text-white font-semibold text-sm shadow hover:bg-green-600 transition-colors duration-200 cursor-pointer"
                    title="네이버 지도 새 창에서 열기"
                  >
                    네이버 지도 열기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 튜토리얼 툴팁 */}
      {isTutorialMode && tutorialTooltip && (() => {
        const transform = tutorialTooltipDirection === 'top' 
          ? 'translate(-50%, -100%)' 
          : 'translate(-50%, 0)';

        return (
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${tutorialTooltipPosition.x}px`,
              top: `${tutorialTooltipPosition.y}px`,
              transform: transform,
            }}
          >
            {/* 상단 방향 */}
            {tutorialTooltipDirection === 'top' && (
              <>
                <div className="bg-blue-600 text-white rounded-lg shadow-2xl p-4 max-w-xs min-w-[280px] mb-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{tutorialTooltip.title}</h3>
                      <p className="text-sm leading-relaxed">{tutorialTooltip.description}</p>
                      <p className="text-xs mt-2 opacity-90">한 번 더 터치하면 팝업이 열립니다</p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600 mx-auto"
                  style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}
                />
              </>
            )}

            {/* 하단 방향 */}
            {tutorialTooltipDirection === 'bottom' && (
              <>
                <div
                  className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-blue-600 mx-auto mb-2"
                  style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}
                />
                <div className="bg-blue-600 text-white rounded-lg shadow-2xl p-4 max-w-xs min-w-[280px]">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{tutorialTooltip.title}</h3>
                      <p className="text-sm leading-relaxed">{tutorialTooltip.description}</p>
                      <p className="text-xs mt-2 opacity-90">한 번 더 터치하면 팝업이 열립니다</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* Dialogflow 챗봇 플로팅 버튼 */}
      <Chatbot language={currentLanguage} />
    </div>
  );
}

export default FrienderPageMobile;
