import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import FrienderPageMobile from './FrienderPage-mobile';
import Frender3DModel from './Frender3DModel';
import Chatbot from './Chatbot';

const DRONE_VIDEO_PLAYLIST = [
  {
    title: '드론 이론의 개념',
    category: '드론 이론',
    description: '비행 원리를 이해하기 위한 가장 기초적인 개념을 정리했습니다.',
    url: 'https://youtu.be/hmxy1YirO4o',
  },
  {
    title: '드론 이론의 구조',
    category: '드론 이론',
    description: '기체를 구성하는 핵심 구조와 역할을 확인해보세요.',
    url: 'https://youtu.be/d_sz10Lu7cs',
  },
  {
    title: '드론 이론의 원리',
    category: '드론 이론',
    description: '비행 제어와 안정화 메커니즘을 자세히 다룹니다.',
    url: 'https://youtu.be/VHH91q3uO0I',
  },
  {
    title: '드론 이론의 안전수칙',
    category: '드론 이론',
    description: '안전한 비행을 위한 필수 규칙을 체크하세요.',
    url: 'https://youtu.be/9E1OXKQhXQg',
  },
  {
    title: '드론 실습의 조난자 찾기',
    category: '드론 실습',
    description: '실전 상황을 가정한 조난자 수색 미션 영상을 제공합니다.',
    url: 'https://youtu.be/Z1B4cOrv84c',
  },
  {
    title: '드론 실습의 불끄기',
    category: '드론 실습',
    description: '화재 대응 훈련을 위한 드론 활용 장면을 확인하세요.',
    url: 'https://youtu.be/bEeKg5p4fJw',
  },
  {
    title: '드론 트랙',
    category: '드론 트랙',
    description: '도시 배경을 활용한 실습 장면을 담았습니다.',
    url: 'https://youtu.be/_ruoKMR3ZEU',
  },
];

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` : '';
};

const PAGE6_MEDIA_OVERRIDES = {
  5: {
    src: '/FrienderFile/VideoFile/WorldGIF.gif',
    alt: 'World GIF 애니메이션',
  },
  6: {
    src: '/FrienderFile/VideoFile/FrinederGIF1.gif',
    alt: 'Friender GIF 애니메이션',
  },
};

const PAGE7_MEDIA_OVERRIDES = {
  5: {
    src: '/FrienderFile/VideoFile/AIStory.gif',
    alt: 'AI Story GIF 애니메이션',
  },
  6: {
    src: '/FrienderFile/VideoFile/DreampathAI.gif',
    alt: 'DreamPath AI GIF 애니메이션',
  },
  7: {
    src: '/FrienderFile/VideoFile/InnoWorks.gif',
    alt: 'InnoWorks GIF 애니메이션',
  },
};

const NAVER_MAP_ADDRESS = '경기도 부천시 원미구 길주로 17, 웹툰융합센터 6층 608호';
const NAVER_MAP_COORDINATES = {
  lat: 37.5047267,
  lng: 126.7870631,
};
const NAVER_MAP_QUERY = encodeURIComponent(NAVER_MAP_ADDRESS);
const NAVER_MAP_EMBED_URL = `https://map.naver.com/v5/search/${NAVER_MAP_QUERY}?c=${NAVER_MAP_COORDINATES.lng},${NAVER_MAP_COORDINATES.lat},21,0,0,0,dh`;
const NAVER_MAP_SHARE_URL = `https://map.naver.com/v5/search/${NAVER_MAP_QUERY}?c=${NAVER_MAP_COORDINATES.lng},${NAVER_MAP_COORDINATES.lat},21,0,0,0,dh`;
function FrienderPage({ onBack = null }) {
  // 화면 크기 상태 관리
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1025);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth <= 1450);
  
  // 원본 이미지 비율 계산 (2480:3507)
  const originalAspectRatio = 2382 / 3369; // 약 0.707
  
  // 플립북 크기 계산 함수
  const calculateFlipBookSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 화면의 40% 너비를 기준으로 하되, 최소 400px, 최대 600px
    const targetWidth = Math.max(400, Math.min(800, screenWidth * 0.4));
    
    // 원본 비율을 유지하여 높이 계산
    const targetHeight = targetWidth / originalAspectRatio;
    
    // 화면 높이의 80%를 넘지 않도록 제한
    const maxHeight = screenHeight * 0.8;
    if (targetHeight > maxHeight) {
      const adjustedWidth = maxHeight * originalAspectRatio;
      return {
        width: Math.max(350, adjustedWidth),
        height: maxHeight
      };
    }
    
    return {
      width: targetWidth,
      height: targetHeight
    };
  };
  
  const [flipBookSize, setFlipBookSize] = React.useState(calculateFlipBookSize());
  
  // 플립북 참조
  const flipBookRef = React.useRef(null);
  
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isCoverPage, setIsCoverPage] = React.useState(true);
  const [isFirstPage, setIsFirstPage] = React.useState(true);
  const [isLastPage, setIsLastPage] = React.useState(false);
  
  
  // 마우스 이벤트 활성화 상태 관리
  const [mouseEventsEnabled, setMouseEventsEnabled] = React.useState(false);
  
  // front.gif 표시 상태 관리
  const [showFrontGif, setShowFrontGif] = React.useState(false);
  const [showSvgBackground, setShowSvgBackground] = React.useState(false);

  // 3페이지 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState(null);
  
  // 3페이지 이미지 모달 상태 관리
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [selectedImageType, setSelectedImageType] = React.useState(null); // '3-4-1', '3-4-2', '3-6-1'
  
  // 추가 4개 영역 모달 상태 관리
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = React.useState(false);
  const [selectedAdditionalArea, setSelectedAdditionalArea] = React.useState(null);
  
  // 4페이지 모달 상태 관리
  const [isPage4ModalOpen, setIsPage4ModalOpen] = React.useState(false);
  const [selectedPage4Area, setSelectedPage4Area] = React.useState(null);
  
  // 4페이지 영역 2번 전용 모달 상태 관리 (테스트용)
  const [isPage4Area2ModalOpen, setIsPage4Area2ModalOpen] = React.useState(false);
  
  // 5페이지 모달 상태 관리
  const [isPage5ModalOpen, setIsPage5ModalOpen] = React.useState(false);
  const [selectedPage5Area, setSelectedPage5Area] = React.useState(null);
  
  const [isPage53DModalOpen, setIsPage53DModalOpen] = React.useState(false);
  const [selectedPart, setSelectedPart] = React.useState(1); // 선택된 파트 (1-4)
  const [currentPartModel, setCurrentPartModel] = React.useState(null); // 현재 표시할 파트 모델
  const [isPage53DModelLoading, setIsPage53DModelLoading] = React.useState(false); // 5페이지 3D 모델 로딩 상태
  const [modalKey, setModalKey] = React.useState(0); // 모달 새로고침을 위한 키
  
  const [isPage5ExteriorModalOpen, setIsPage5ExteriorModalOpen] = React.useState(false);
  const [selectedExteriorType, setSelectedExteriorType] = React.useState(null); // 선택된 외장재 타입 (3-6)
  
  // 6페이지 모달 상태 관리
  const [isPage6ModalOpen, setIsPage6ModalOpen] = React.useState(false);
  const [selectedPage6Area, setSelectedPage6Area] = React.useState(null);
  const [hoveredArea6, setHoveredArea6] = React.useState(null);
  const [isPage63DModalOpen, setIsPage63DModalOpen] = React.useState(false);
  
  // 2페이지 팝업 모달 상태 관리
  const [isPage2ModalOpen, setIsPage2ModalOpen] = React.useState(false);
  const [selectedPage2Area, setSelectedPage2Area] = React.useState(null);
  
  // 8페이지 모달 상태 관리
  const [isPage8ModalOpen, setIsPage8ModalOpen] = React.useState(false);
  const [selectedPage8Area, setSelectedPage8Area] = React.useState(null);
  
  // 9페이지 모달 상태 관리
  const [isPage9ModalOpen, setIsPage9ModalOpen] = React.useState(false);
  const [selectedPage9Area, setSelectedPage9Area] = React.useState(null);
  
  // 10페이지 모달 상태 관리
  const [isPage10ModalOpen, setIsPage10ModalOpen] = React.useState(false);
  const [selectedPage10Area, setSelectedPage10Area] = React.useState(null);
  
  // 11페이지 모달 상태 관리
  const [isPage11ModalOpen, setIsPage11ModalOpen] = React.useState(false);
  
  // 3페이지 팝업 모달 상태 관리
  const [isPage3ModalOpen, setIsPage3ModalOpen] = React.useState(false);
  const [selectedPage3Area, setSelectedPage3Area] = React.useState(null);
  
  // 각 페이지별 호버 상태 관리
  const [hoveredArea2, setHoveredArea2] = React.useState(null);
  const [hoveredArea3, setHoveredArea3] = React.useState(null);
  const [hoveredArea4, setHoveredArea4] = React.useState(null);
  const [hoveredArea5, setHoveredArea5] = React.useState(null);
  const [hoveredArea7, setHoveredArea7] = React.useState(null);
  const [hoveredArea8, setHoveredArea8] = React.useState(null);
  const [hoveredArea9, setHoveredArea9] = React.useState(null);
  const [hoveredArea10, setHoveredArea10] = React.useState(null);
  const [hoveredArea11, setHoveredArea11] = React.useState(null);
  
  // 3페이지 모달 내 추가 영역 호버 상태 관리
  const [hoveredModalArea, setHoveredModalArea] = React.useState(null);
  
  // 추가 영역 이미지 모달 상태 관리
  const [isAdditionalImageModalOpen, setIsAdditionalImageModalOpen] = React.useState(false);
  const [selectedAdditionalImageType, setSelectedAdditionalImageType] = React.useState(null);
  
  // 새로운 영역 모달 상태 관리
  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = React.useState(false);
  
  // 새로운 영역 모달창 확대/축소 상태 관리
  const [newAreaModalZoomLevel, setNewAreaModalZoomLevel] = React.useState(1);
  const [isNewAreaModalZoomed, setIsNewAreaModalZoomed] = React.useState(false);
  
  // 새로운 영역 모달창 드래그 상태
  const [newAreaModalDragOffset, setNewAreaModalDragOffset] = React.useState({ x: 0, y: 0 });
  const [isNewAreaModalDragging, setIsNewAreaModalDragging] = React.useState(false);
  const newAreaModalDragStartRef = React.useRef({ x: 0, y: 0 });
  

  // 7페이지 영상 상태 관리
  const [playingVideo, setPlayingVideo] = React.useState(null);
  const [showVideo, setShowVideo] = React.useState(false);

  // 인트로 화면 상태 관리
  const [showIntro, setShowIntro] = React.useState(true);
  const [logoOpacity, setLogoOpacity] = React.useState(0);
  const [whiteScreenVisible, setWhiteScreenVisible] = React.useState(true);
  const [mainScreenVisible, setMainScreenVisible] = React.useState(false);
  
  // 확대/축소 상태 관리
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);
  
  // 미니맵 상태 관리
  const [showMinimap, setShowMinimap] = React.useState(false);
  
  // 드래그 상태 관리
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  
  // 드래그 시작점을 ref로 관리 (무한 루프 방지)
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  
  // 플립북 컨테이너 참조
  const flipBookContainerRef = React.useRef(null);
  
  // 모달창 확대/축소 상태 관리
  const [modalZoomLevel, setModalZoomLevel] = React.useState(1);
  const [isModalZoomed, setIsModalZoomed] = React.useState(false);
  
  // 모달창 드래그 상태
  const [modalDragOffset, setModalDragOffset] = React.useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = React.useState(false);
  const modalDragStartRef = React.useRef({ x: 0, y: 0 });
  

  // SVG 페이지 데이터
  const pageData = [
    { id: 1, svg: "/FrienderFile/Page/1.svg", isCover: true },
    { id: 2, svg: "/FrienderFile/Page/2.svg" },
    { id: 3, svg: "/FrienderFile/Page/3.svg" },
    { id: 4, svg: "/FrienderFile/Page/4.svg" },
    { id: 5, svg: "/FrienderFile/Page/5.svg" },
    { id: 6, svg: "/FrienderFile/Page/6.svg" },
    { id: 7, svg: "/FrienderFile/Page/7.svg" },
    { id: 8, svg: "/FrienderFile/Page/8.svg" },
    { id: 9, svg: "/FrienderFile/Page/9.svg" },
    { id: 10, svg: "/FrienderFile/Page/10.svg" },
    { id: 11, svg: "/FrienderFile/Page/11.svg" }
  ];

  // 화면 크기 변경 감지
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
      setIsSmallScreen(window.innerWidth <= 1450);
      setFlipBookSize(calculateFlipBookSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2단계: 흰 화면이 위로 사라지는 전환 (3D 모델 로딩 완료 후 실행)
  // 이 함수는 더 이상 사용되지 않음 - useEffect 내부로 이동됨

  // 로고 애니메이션 완료 후 화면 전환
  React.useEffect(() => {
    if (logoOpacity === 1) {
      // 로고 애니메이션이 완료되면 0.5초 후 2단계 시작
      setTimeout(() => {
    console.log('2단계 애니메이션 시작');
    setWhiteScreenVisible(false);
    
    // 전환 완료 후 본 화면 표시
    setTimeout(() => {
      setMainScreenVisible(true);
      // 인트로 완료 후 1초 뒤에 GIF 시작
      setTimeout(() => {
        setShowFrontGif(true);
      }, 1000);
    }, 500);
      }, 500);
    }
  }, [logoOpacity]);

  // 인트로 화면 애니메이션 시퀀스
  React.useEffect(() => {
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
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

    // 로고 애니메이션 시작
    setTimeout(() => {
      logoAnimation();
    }, 500);
  }, []);

  // front.gif 3.2초 후 자동 비활성화, 3초에 SVG 배경 활성화
  React.useEffect(() => {
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


  // 페이지 변경 이벤트 핸들러
  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    // 첫 페이지(0) 또는 마지막 페이지(10)인지 확인
    const firstPage = newPage === 0;
    const lastPage = newPage === pageData.length - 1;
    setIsFirstPage(firstPage);
    setIsLastPage(lastPage);
    setIsCoverPage(firstPage || lastPage);
    
    // 첫 페이지(표지)로 돌아올 때 front.gif 초기화
    if (firstPage) {
      setShowFrontGif(true);
      setShowSvgBackground(false);
    }
    
    // 페이지 변경 시 확대/축소 상태 리셋
    setZoomLevel(1);
    setIsZoomed(false);
    setShowMinimap(false);
    setDragOffset({ x: 0, y: 0 });
  };

  /**
   * 홈 버튼 클릭 핸들러
   */
  const handleHomeClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    // 인트로 화면 재시작
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);

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
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      };

      // 로고 애니메이션 시작
      logoAnimation();
    }, 500);
  };

  /**
   * 프린터 버튼 클릭 핸들러
   */
  const handlePrintClick = () => {
    const pdfUrl = '/FrienderFile/Friender-Pdf/프랜더-카탈로그.pdf';
    const pdfWindow = window.open(pdfUrl, '_blank');
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
    const link = document.createElement('a');
    link.href = '/FrienderFile/Friender-Pdf/프랜더-카탈로그.pdf';
    link.download = '프랜더-카탈로그.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Isover',
          text: 'Isover에 대해 확인해보세요!',
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  /**
   * 목차 버튼 클릭 핸들러
   */
  const handleTocClick = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(1); // 2번째 페이지(목차 페이지)로 이동
    }
  };

  /**
   * 확대 버튼 클릭 핸들러
   */
  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 0.2, 2); // 최대 2배까지 확대
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel !== 1); // 1이 아닐 때 리셋 버튼 활성화
    setShowMinimap(newZoomLevel > 1); // 확대 시 미니맵 표시
    // 확대 시 드래그 오프셋 리셋 (중심에서 시작)
    if (newZoomLevel > 1) {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  /**
   * 축소 버튼 클릭 핸들러
   */
  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 0.2, 0.5); // 최소 0.5배까지 축소
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel !== 1); // 1이 아닐 때 리셋 버튼 활성화
    setShowMinimap(newZoomLevel > 1); // 축소 시 미니맵 표시/숨김
    // 축소 시 드래그 오프셋 리셋 (중심에서 시작)
    if (newZoomLevel <= 1) {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  /**
   * 확대/축소 리셋 핸들러
   */
  const handleZoomReset = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setShowMinimap(false); // 리셋 시 미니맵 숨김
    setDragOffset({ x: 0, y: 0 }); // 드래그 오프셋도 리셋
  };

  /**
   * 모달창 확대 핸들러
   */
  const handleModalZoomIn = () => {
    const newZoomLevel = Math.min(modalZoomLevel + 0.2, 2); // 최대 2배까지 확대
    setModalZoomLevel(newZoomLevel);
    setIsModalZoomed(newZoomLevel !== 1);
  };

  /**
   * 모달창 축소 핸들러
   */
  const handleModalZoomOut = () => {
    const newZoomLevel = Math.max(modalZoomLevel - 0.2, 0.5); // 최소 0.5배까지 축소
    setModalZoomLevel(newZoomLevel);
    setIsModalZoomed(newZoomLevel !== 1);
  };

  /**
   * 모달창 확대/축소 리셋 핸들러
   */
  const handleModalZoomReset = () => {
    setModalZoomLevel(1);
    setIsModalZoomed(false);
  };

  // 모달창 드래그 핸들러들 (플립북 스타일로 수정)
  const handleModalDragStart = (e) => {
    // 클릭 가능한 영역인지 확인 (버튼, 클릭 가능한 요소 등)
    const target = e.target;
    const isClickableArea = target.closest('button') || 
                            target.closest('[data-clickable="true"]') || 
                            target.closest('[onclick]') ||
                            target.closest('.cursor-pointer') ||
                            target.hasAttribute('onClick');
    
    if (!isClickableArea) {
      setIsModalDragging(true);
      modalDragStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleModalDragMove = (e) => {
    if (isModalDragging) {
      const deltaX = e.clientX - modalDragStartRef.current.x;
      const deltaY = e.clientY - modalDragStartRef.current.y;
      
      // 드래그 감도 조정 (더 부드럽게)
      const sensitivity = 1.0;
      
      setModalDragOffset(prev => {
        const newOffset = {
          x: prev.x + (deltaX * sensitivity),
          y: prev.y + (deltaY * sensitivity)
        };
        
        // 화면 경계 내에서만 드래그 허용
        const maxX = window.innerWidth * 0.3;
        const maxY = window.innerHeight * 0.3;
        
        newOffset.x = Math.max(-maxX, Math.min(maxX, newOffset.x));
        newOffset.y = Math.max(-maxY, Math.min(maxY, newOffset.y));
        
        return newOffset;
      });
      
      modalDragStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleModalDragEnd = () => {
    setIsModalDragging(false);
  };

  // 모달창 위치 리셋
  const handleModalPositionReset = () => {
    setModalDragOffset({ x: 0, y: 0 });
  };

  /**
   * 마우스 다운 핸들러 (드래그 시작)
   */
  const handleMouseDown = (e) => {
    if (isZoomed) {
      // 영역 클릭 요소인지 확인 (클릭 가능한 영역이 아닌 경우에만 드래그 시작)
      const target = e.target;
      const isClickableArea = target.closest('[data-clickable="true"]') || 
                              target.closest('button') || 
                              target.closest('[onclick]') ||
                              target.closest('.cursor-pointer') ||
                              target.hasAttribute('onClick');
      
      if (!isClickableArea) {
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    }
  };

  /**
   * 마우스 이동 핸들러 (드래그 중)
   */
  const handleMouseMove = (e) => {
    if (isDragging && isZoomed) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      // 드래그 감도 조정 (더 부드럽게)
      const sensitivity = 1.0;
      
      setDragOffset(prev => ({
        x: prev.x + (deltaX * sensitivity),
        y: prev.y + (deltaY * sensitivity)
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  /**
   * 마우스 업 핸들러 (드래그 종료)
   */
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /**
   * 터치 시작 핸들러 (모바일 드래그 시작)
   */
  const handleTouchStart = (e) => {
    if (isZoomed && e.touches.length === 1) {
      // 영역 클릭 요소인지 확인 (클릭 가능한 영역이 아닌 경우에만 드래그 시작)
      const target = e.target;
      const isClickableArea = target.closest('[data-clickable="true"]') || 
                              target.closest('button') || 
                              target.closest('[onclick]') ||
                              target.closest('.cursor-pointer') ||
                              target.hasAttribute('onClick');
      
      if (!isClickableArea) {
        setIsDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  /**
   * 터치 이동 핸들러 (모바일 드래그 중)
   */
  const handleTouchMove = (e) => {
    if (isDragging && isZoomed && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;
      
      // 드래그 감도 조정 (더 부드럽게)
      const sensitivity = 1.0;
      
      setDragOffset(prev => ({
        x: prev.x + (deltaX * sensitivity),
        y: prev.y + (deltaY * sensitivity)
      }));
      
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  /**
   * 터치 종료 핸들러 (모바일 드래그 종료)
   */
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  // 터치 이벤트 리스너 직접 추가 (passive: false로 설정)
  React.useEffect(() => {
    const container = flipBookContainerRef.current;
    if (!container) return;

    const touchMoveHandler = (e) => {
      if (isDragging && isZoomed && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - dragStartRef.current.x;
        const deltaY = e.touches[0].clientY - dragStartRef.current.y;
        
        const sensitivity = 1.0;
        
        setDragOffset(prev => ({
          x: prev.x + (deltaX * sensitivity),
          y: prev.y + (deltaY * sensitivity)
        }));
        
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        e.preventDefault();
      }
    };

    // passive: false로 설정하여 preventDefault 사용 가능
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });

    return () => {
      container.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [isDragging, isZoomed]); // dragStart 제거


  /**
   * 터치 영역 마우스 다운 핸들러
   */
  const handleTouchAreaMouseDown = (direction) => {
    setMouseEventsEnabled(true);
    console.log('useMouseEvents 상태: 활성화됨');
    
    // 즉시 페이지 이동도 실행
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };

  /**
   * 터치 영역 마우스 업 핸들러
   */
  const handleTouchAreaMouseUp = () => {
    // 약간의 지연 후 비활성화 (제스처 완료 대기)
    setTimeout(() => {
      setMouseEventsEnabled(false);
      console.log('useMouseEvents 상태: 비활성화됨');
    }, 200);
  };

  /**
   * 터치 영역 터치 시작 핸들러
   */
  const handleTouchAreaTouchStart = (direction) => {
    setMouseEventsEnabled(true);
    console.log('useMouseEvents 상태: 활성화됨 (터치)');
    
    // 즉시 페이지 이동도 실행
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };

  /**
   * 터치 영역 터치 끝 핸들러
   */
  const handleTouchAreaTouchEnd = () => {
    // 약간의 지연 후 비활성화 (제스처 완료 대기)
    setTimeout(() => {
      setMouseEventsEnabled(false);
      console.log('useMouseEvents 상태: 비활성화됨 (터치)');
    }, 200);
  };

  /**
   * 영역별 클릭 핸들러들
   */

  // 기존 페이지 이동 핸들러는 주석 처리하고 팝업 모달로 변경
  // const handleArea2Click = () => {
  //   // 2번 영역: 4번 페이지로 이동 (1페이지 건너뛰기)
  //   if (flipBookRef.current) {
  //     flipBookRef.current.pageFlip().turnToPage(3); // 0-based index이므로 3은 4번째 페이지
  //   }
  // };

  // const handleArea3Click = () => {
  //   // 3번 영역: 5번 페이지로 이동 (1페이지 건너뛰기)
  //   if (flipBookRef.current) {
  //     flipBookRef.current.pageFlip().turnToPage(4); // 0-based index이므로 4는 5번째 페이지
  //   }
  // };

  // const handleArea4Click = () => {
  //   // 4번 영역: 6번 페이지로 이동 (2페이지 건너뛰기)
  //   if (flipBookRef.current) {
  //     flipBookRef.current.pageFlip().turnToPage(5); // 0-based index이므로 5는 6번째 페이지
  //   }
  // };

  // const handleArea5Click = () => {
  //   // 5번 영역: 유튜브 링크 새 탭에서 열기
  //   window.open('https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos', '_blank');
  // };

  /**
   * 새로운 영역 클릭 핸들러
   */
  const handleNewAreaClick = () => {
    setIsNewAreaModalOpen(true);
  };

  /**
   * 새로운 영역 모달 닫기
   */
  const closeNewAreaModal = () => {
    setIsNewAreaModalOpen(false);
    // 모달 닫을 때 상태 리셋
    setNewAreaModalZoomLevel(1);
    setIsNewAreaModalZoomed(false);
    setNewAreaModalDragOffset({ x: 0, y: 0 });
    setIsNewAreaModalDragging(false);
    newAreaModalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 새로운 영역 모달창 확대
   */
  const handleNewAreaModalZoomIn = () => {
    setNewAreaModalZoomLevel(prev => Math.min(prev + 0.2, 3));
    setIsNewAreaModalZoomed(true);
  };

  /**
   * 새로운 영역 모달창 축소
   */
  const handleNewAreaModalZoomOut = () => {
    setNewAreaModalZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    if (newAreaModalZoomLevel <= 0.6) {
      setIsNewAreaModalZoomed(false);
    }
  };

  /**
   * 새로운 영역 모달창 확대/축소 리셋
   */
  const handleNewAreaModalZoomReset = () => {
    setNewAreaModalZoomLevel(1);
    setIsNewAreaModalZoomed(false);
  };

  /**
   * 새로운 영역 모달창 위치 리셋
   */
  const handleNewAreaModalPositionReset = () => {
    setNewAreaModalDragOffset({ x: 0, y: 0 });
  };
  /**
   * 새로운 영역 모달창 드래그 시작
   */
  const handleNewAreaModalDragStart = (e) => {
    if (e.button !== 0) return; // 왼쪽 마우스 버튼만
    setIsNewAreaModalDragging(true);
    newAreaModalDragStartRef.current = {
      x: e.clientX - newAreaModalDragOffset.x,
      y: e.clientY - newAreaModalDragOffset.y
    };
  };

  /**
   * 새로운 영역 모달창 드래그 중
   */
  const handleNewAreaModalDragMove = (e) => {
    if (!isNewAreaModalDragging) return;
    setNewAreaModalDragOffset({
      x: e.clientX - newAreaModalDragStartRef.current.x,
      y: e.clientY - newAreaModalDragStartRef.current.y
    });
  };

  /**
   * 새로운 영역 모달창 드래그 종료
   */
  const handleNewAreaModalDragEnd = () => {
    setIsNewAreaModalDragging(false);
  };

  /**
   * 3페이지 영역 클릭 핸들러
   */
  const handlePage3AreaClick = (areaNumber) => {
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
   * 모달 닫기 핸들러
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
    setHoveredModalArea(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 추가 영역 이미지 모달 열기 핸들러
   */
  const openAdditionalImageModal = (imageType) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedAdditionalImageType(imageType);
    setIsAdditionalImageModalOpen(true);
  };

  /**
   * 추가 영역 이미지 모달 닫기 핸들러
   */
  const closeAdditionalImageModal = () => {
    setIsAdditionalImageModalOpen(false);
    setSelectedAdditionalImageType(null);
    setHoveredModalArea(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 이미지 모달 열기 핸들러
   */
  const openImageModal = (imageType) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedImageType(imageType);
    setIsImageModalOpen(true);
  };

  /**
   * 이미지 모달 닫기 핸들러
   */
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageType(null);
    setHoveredModalArea(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 추가 모달 닫기 핸들러
   */
  const closeAdditionalModal = () => {
    setIsAdditionalModalOpen(false);
    setSelectedAdditionalArea(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 4페이지 영역 클릭 핸들러
   */
  const handlePage4AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPage4Area(areaNumber);
    setIsPage4ModalOpen(true);
  };

  /**
   * 4페이지 모달 닫기 핸들러
   */
  const closePage4Modal = () => {
    setIsPage4ModalOpen(false);
    setSelectedPage4Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
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
   * 파트별 모델 경로 반환 함수
   */
  const getModelPathByPart = (partNumber) => {
    switch (partNumber) {
      case 1:
        return "/IsoverFile/3dmodel/1_System_Fiber_SET_test.glb"; // 파이버시멘트보드
      case 2:
        return "/IsoverFile/3dmodel/2_System_Alu-Complex_SET_test.glb"; // AL 복합판넬
      case 3:
        return "/IsoverFile/3dmodel/3_System_Alu-Sheet_SET_test.glb"; // AL 시트판넬
      case 4:
        return "/IsoverFile/3dmodel/4_System_Three_SET_test.glb"; // 벽돌판넬
      default:
        return "/IsoverFile/3dmodel/system_with_panel_test.glb";
    }
  };

  /**
   * 파트별 이름 반환 함수
   */
  const getPartName = (partNumber) => {
    switch (partNumber) {
      case 1:
        return "파이버시멘트보드";
      case 2:
        return "AL 복합판넬";
      case 3:
        return "AL 시트판넬";
      case 4:
        return "벽돌판넬";
      default:
        return "전체 시스템";
    }
  };

  /**
   * 파트별 모델 스케일 반환 함수
   */
  const getModelScaleByPart = (partNumber) => {
    switch (partNumber) {
      case 1:
        return 0.5; // 1_System_Fiber_SET
      case 2:
        return 0.5; // 2_System_Alu-Complex_SET
      case 3:
        return 0.5; // 3_System_Alu-Sheet_SET
      case 4:
        return 0.5; // 4_System_Three_SET
      default:
        return 0.3; // 기본 모델
    }
  };

  /**
   * 외장재 타입별 이름 반환 함수
   */
  const getExteriorTypeName = (typeNumber) => {
    switch (typeNumber) {
      case 3:
        return "파이버시멘트보드";
      case 4:
        return "AL 복합판넬";
      case 5:
        return "AL 시트판넬";
      case 6:
        return "벽돌판넬";
      default:
        return "외장재";
    }
  };

  /**
   * 외장재 타입별 모델 경로 반환 함수
   */
  const getExteriorModelPath = (typeNumber) => {
    switch (typeNumber) {
      case 3:
        return "/IsoverFile/3dmodel/1_System_Fiber_SET_test.glb"; // 파이버시멘트보드
      case 4:
        return "/IsoverFile/3dmodel/2_System_Alu-Complex_SET_test.glb"; // AL 복합판넬
      case 5:
        return "/IsoverFile/3dmodel/3_System_Alu-Sheet_SET_test.glb"; // AL 시트판넬
      case 6:
        return "/IsoverFile/3dmodel/4_System_Three_SET_test.glb"; // 조적판넬
      default:
        return "/IsoverFile/3dmodel/system_with_panel_test.glb";
    }
  };

  /**
   * 5페이지 영역 클릭 핸들러
   */
  const handlePage5AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    // 5페이지는 6개 영역 (5-1, 5-2, 5-1-img, 5-2-img, 5-3-img, 5-4-img)
    // 모든 영역이 팝업 모달로 변경
    setSelectedPage5Area(areaNumber);
    setIsPage5ModalOpen(true);
    
    // 기존 3D 모델 및 외장재 모달 관련 코드는 주석 처리
    // if (areaNumber === 1) {
    //   // 첫 번째 영역 - 3D 모델 모달 열기
    //   setCurrentPartModel(null);
    //   setSelectedPart(1);
    //   setIsPage53DModelLoading(true); // 로딩 상태 시작
    //   setModalKey(prev => prev + 1); // 모달 새로고침을 위한 키 증가
    //   setIsPage53DModalOpen(true);
    // } else if (areaNumber === 2) {
    //   // 두 번째 영역만 모달 열기
    //   setIsPage5ModalOpen(true);
    // } else if (areaNumber >= 3 && areaNumber <= 6) {
    //   // 외장재 영역들 (3-6번) - 외장재 모달 열기
    //   setSelectedExteriorType(areaNumber);
    //   setIsPage5ExteriorModalOpen(true);
    // }
  };

  /**
   * 5페이지 모달 닫기 핸들러
   */
  const closePage5Modal = () => {
    setIsPage5ModalOpen(false);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
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
   * 5페이지 3D 모델 파트 클릭 핸들러
   */
  const handlePage5PartClick = (partNumber) => {
    console.log(`Part ${partNumber} clicked`);
    setSelectedPart(partNumber);
    setIsPage53DModelLoading(true); // 파트 변경 시 로딩 상태 시작
    
    // 파트별 모델 경로 설정
    const partModelPath = getModelPathByPart(partNumber);
    setCurrentPartModel(partModelPath);
    
    // 모달 새로고침을 위한 키 증가
    setModalKey(prev => prev + 1);
  };

  /**
   * 6페이지 영역 클릭 핸들러
   */
  const handlePage6AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    // areaNumber에 따라 파일명 결정
    // 1: 6-1, 2: 6-2, 3: 6-3, 4: 6-4, 5: 6-1-img, 6: 6-2-img, 7: 6-3-img
    if (areaNumber === 7) {
      // 6-3-img 영역은 3D 모델 모달 열기
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
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
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
  const handlePage2AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPage2Area(areaNumber);
    setIsPage2ModalOpen(true);
  };

  /**
   * 2페이지 모달 닫기 핸들러
   */
  const closePage2Modal = () => {
    setIsPage2ModalOpen(false);
    setSelectedPage2Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  // 7페이지 모달 상태 관리
  const [isPage7ModalOpen, setIsPage7ModalOpen] = React.useState(false);
  const [selectedPage7Area, setSelectedPage7Area] = React.useState(null);
  const page6MediaOverride = selectedPage6Area ? PAGE6_MEDIA_OVERRIDES[selectedPage6Area] : null;
  const page7MediaOverride = selectedPage7Area ? PAGE7_MEDIA_OVERRIDES[selectedPage7Area] : null;

  /**
   * 7페이지 영역 클릭 핸들러
   */
  const handlePage7AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    // 7페이지는 7개 영역 (7-1, 7-2, 7-3, 7-4, 7-1-img, 7-2-img, 7-3-img)
    setSelectedPage7Area(areaNumber);
    setIsPage7ModalOpen(true);
    
    // 기존 웹사이트 링크와 영상 관련 코드는 주석 처리
    // if (areaNumber === 2) {
    //   // 왼쪽 로고 영역: Isover 링크
    //   window.open('https://www.isover.co.kr/', '_blank');
    // } else if (areaNumber === 3) {
    //   // 오른쪽 로고 영역: Yoochang 링크
    //   window.open('http://www.yoochang.com/', '_blank');
    // } else if (areaNumber === 4) {
    //   // 하단 노란색 영역: Isover 링크
    //   window.open('https://www.isover.co.kr/', '_blank');
    // } else if (areaNumber === 1) {
    //   // 1번 영역: 영상 토글
    //   setShowVideo(!showVideo);
    // }
  };

  /**
   * 7페이지 모달 닫기 핸들러
   */
  const closePage7Modal = () => {
    setIsPage7ModalOpen(false);
    setSelectedPage7Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };
  /**
   * 8페이지 영역 클릭 핸들러
   */
  const handlePage8AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPage8Area(areaNumber);
    setIsPage8ModalOpen(true);
  };

  /**
   * 8페이지 모달 닫기 핸들러
   */
  const closePage8Modal = () => {
    setIsPage8ModalOpen(false);
    setSelectedPage8Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 9페이지 영역 클릭 핸들러
   */
  const handlePage9AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPage9Area(areaNumber);
    setIsPage9ModalOpen(true);
  };

  /**
   * 9페이지 모달 닫기 핸들러
   */
  const closePage9Modal = () => {
    setIsPage9ModalOpen(false);
    setSelectedPage9Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 10페이지 영역 클릭 핸들러
   */
  const handlePage10AreaClick = (areaNumber) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPage10Area(areaNumber);
    setIsPage10ModalOpen(true);
  };

  /**
   * 10페이지 모달 닫기 핸들러
   */
  const closePage10Modal = () => {
    setIsPage10ModalOpen(false);
    setSelectedPage10Area(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  /**
   * 11페이지 영역 클릭 핸들러
   */
  const handlePage11AreaClick = () => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setIsPage11ModalOpen(true);
  };

  /**
   * 11페이지 모달 닫기 핸들러
   */
  const closePage11Modal = () => {
    setIsPage11ModalOpen(false);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };

  const handleOpenNaverMap = React.useCallback(() => {
    window.open(NAVER_MAP_SHARE_URL, '_blank', 'noopener,noreferrer');
  }, []);


  /**
   * 영상 닫기 핸들러
   */
  const closeVideo = () => {
    setShowVideo(false);
  };

  /**
   * 페이지 네비게이션 함수들
   */
  const goToFirstPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(0);
    }
  };

  const goToPreviousPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const goToLastPage = () => {
    if (flipBookRef.current) {
      const totalPages = flipBookRef.current.pageFlip().getPageCount();
      flipBookRef.current.pageFlip().turnToPage(totalPages - 1);
    }
  };

  // 모바일 화면인 경우 모바일 컴포넌트 렌더링
  if (isMobile) {
    return <FrienderPageMobile onBack={onBack} />;
  }
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
              src="/FrienderFile/Interactive/Freinder-Logo-L-G.png"
              alt="Friender Logo"
              className="max-w-full max-h-full object-contain"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      )}

      {/* 본 화면 */}
      {mainScreenVisible && (
        <div className="w-full h-screen overflow-hidden bg-white flex">
      {/* 왼쪽 위 로고 (홈 버튼) */}
      <div className="flex-shrink-0 w-[10%] max-w-[200px] pt-6 pl-4">
        <button onClick={handleHomeClick} className="cursor-pointer flex items-start w-full">
          <img
            src="/FrienderFile/Interactive/Freinder-Logo-L-B.png"
            alt="Friender Logo"
            className="w-full h-auto"
          />
        </button>
        
        {/* 미니맵 */}
        {showMinimap && (
          <div className="mt-4 w-full relative z-[9999]">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1 text-center">현재 보기</div>
              <div className="relative w-full h-24 bg-gray-100 rounded overflow-hidden">
                {/* 표지 페이지인 경우 단일 페이지 표시 */}
                {isCoverPage ? (
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                      backgroundImage: `url(/FrienderFile/Page/1.svg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ) : (
                  /* 일반 페이지인 경우 양쪽 페이지 표시 */
                  <div className="flex w-full h-full">
                    {/* 왼쪽 페이지 */}
                    <div 
                      className="w-1/2 h-full bg-cover bg-center bg-no-repeat opacity-30"
                      style={{
                        backgroundImage: `url(${pageData[currentPage]?.svg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center'
                      }}
                    />
                    {/* 오른쪽 페이지 */}
                    <div 
                      className="w-1/2 h-full bg-cover bg-center bg-no-repeat opacity-30"
                      style={{
                        backgroundImage: `url(${pageData[currentPage + 1]?.svg || pageData[currentPage]?.svg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center'
                      }}
                    />
                  </div>
                )}
                
                {/* 현재 뷰포트 표시 */}
                <div 
                  className="absolute border-2 border-red-500 bg-red-500/20 transition-all duration-200"
                  style={{
                    width: `${100 / zoomLevel}%`,
                    height: `${100 / zoomLevel}%`,
                    left: `${50 - (dragOffset.x / (flipBookSize.width * zoomLevel)) * 100}%`,
                    top: `${50 - (dragOffset.y / (flipBookSize.height * zoomLevel)) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 중앙 플립북 컨테이너 */}
      <div className=" w-full h-full flex items-center justify-center p-4 relative">
        {/* 플립북 컨테이너 하단 텍스트 */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            무용접 파사드 시스템
          </div>
        </div> */}
        
        {/* 돋보기 버튼들 - 플립북 컨테이너 위에 배치 */}
        <div className="absolute top-18 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
          {/* 확대 버튼 */}
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
            title="확대"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>

          {/* 축소 버튼 */}
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
            title="축소"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>

          {/* 확대/축소 리셋 버튼 */}
          {isZoomed && (
            <button
              onClick={handleZoomReset}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="원본 크기로 복원"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center xl:gap-4">
          {/* 왼쪽 네비게이션 버튼들 - 항상 표시하되 표지 페이지에서는 비활성화 */}
          <div className="flex flex-col items-center gap-2">
             {/* Left 버튼 */}
             <button
               onClick={goToPreviousPage}
               className={`transition-transform duration-200 ${isFirstPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title={isFirstPage ? "첫 페이지입니다" : "이전 페이지"}
               disabled={isFirstPage}
             >
               <img
                 src="/IsoverFile/Interacive/arrow_left.svg"
                 alt="이전 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
             {/* First 버튼 */}
             <button
               onClick={goToFirstPage}
               className={`transition-transform duration-200 ${isFirstPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title={isFirstPage ? "이미 첫 페이지입니다" : "첫 페이지"}
               disabled={isFirstPage}
             >
               <img
                 src="/IsoverFile/Interacive/arrow_first.svg"
                 alt="첫 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
          </div>

          {/* 플립북 컨테이너 */}
          <div 
            ref={flipBookContainerRef}
            className="flex items-center justify-center relative overflow-visible"
            style={{ width: '100%', height: '100%' }}
            onMouseDown={isZoomed ? handleMouseDown : undefined}
            onMouseMove={isZoomed ? handleMouseMove : undefined}
            onMouseUp={isZoomed ? handleMouseUp : undefined}
            onMouseLeave={isZoomed ? handleMouseUp : undefined}
            onTouchStart={isZoomed ? handleTouchStart : undefined}
            onTouchEnd={isZoomed ? handleTouchEnd : undefined}
          >
            {/* 플립북 */}
            <div 
              className={`${isZoomed ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                boxShadow: `
                  0 -20px 40px -10px rgba(0, 0, 0, 0.3),
                  0 20px 40px -10px rgba(0, 0, 0, 0.3),
                  -20px 0 40px -10px rgba(0, 0, 0, 0.3),
                  20px 0 40px -10px rgba(0, 0, 0, 0.3)
                `
              }}
            >
            <HTMLFlipBook 
              ref={flipBookRef}
              width={flipBookSize.width} 
              height={flipBookSize.height}
              maxShadowOpacity={0}
              drawShadow={false}
              showCover={true}
              size='fixed'
              disableFlipByClick={true}
              swipeDistance={100}
              flipOnTouch={false}
              useMouseEvents={mouseEventsEnabled}
              usePortrait={false}
              showPageCorners={false}
              onFlip={handlePageFlip}
            >
            {/* 표지 페이지 (첫 번째 페이지) */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[0].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: showSvgBackground ? `url(${pageData[0].svg})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* front.gif 전체 사이즈 배치 */}
                {showFrontGif && (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="/FrienderFile/Interactive/Front.gif"
                      alt="Front Animation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                

                {/* 오른쪽 터치 영역 (표지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 2번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[1].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[1].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 2페이지 6개 영역 배치 (2-1 ~ 2-6) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '16%',
                    left: '7%',
                    width: '50%',
                    height: '11%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(1)}
                  onMouseEnter={() => setHoveredArea2(1)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-1 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '23%',
                    left: '7%',
                    width: '28%',
                    height: '17%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(2)}
                  onMouseEnter={() => setHoveredArea2(2)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '23%',
                    left: '38%',
                    width: '28%',
                    height: '17%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(3)}
                  onMouseEnter={() => setHoveredArea2(3)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-3 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '4%',
                    left: '5%',
                    width: '28%',
                    height: '17%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(4)}
                  onMouseEnter={() => setHoveredArea2(4)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-4 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '4%',
                    left: '39%',
                    width: '25%',
                    height: '16%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(5)}
                  onMouseEnter={() => setHoveredArea2(5)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-5 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea2 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '3%',
                    right: '4%',
                    width: '21%',
                    height: '41%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage2AreaClick(6)}
                  onMouseEnter={() => setHoveredArea2(6)}
                  onMouseLeave={() => setHoveredArea2(null)}
                  title="2-6 팝업"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (2페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 3번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[2].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[2].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 3페이지 영역 5개 배치 - Popup 폴더 파일명에 맞춤 */}
                {/* 3-1.jpg */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isPage3ModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea3 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '7%',
                    width: '24%',
                    height: '25%'
                  }}
                  onClick={() => handlePage3AreaClick(1)}
                  onMouseEnter={() => setHoveredArea3(1)}
                  onMouseLeave={() => setHoveredArea3(null)}
                >
                </div>
                
                {/* 3-2.jpg */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isPage3ModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea3 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '32%',
                    width: '24%',
                    height: '25%'
                  }}
                  onClick={() => handlePage3AreaClick(2)}
                  onMouseEnter={() => setHoveredArea3(2)}
                  onMouseLeave={() => setHoveredArea3(null)}
                >
                </div>
                
                {/* 3-3.png */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isPage3ModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea3 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '14%',
                    left: '6%',
                    width: '25%',
                    height: '26%'
                  }}
                  onClick={() => handlePage3AreaClick(3)}
                  onMouseEnter={() => setHoveredArea3(3)}
                  onMouseLeave={() => setHoveredArea3(null)}
                >
                </div>
                
                {/* 3-4.jpg */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isPage3ModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea3 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '14%',
                    left: '32%',
                    width: '24%',
                    height: '26%'
                  }}
                  onClick={() => handlePage3AreaClick(4)}
                  onMouseEnter={() => setHoveredArea3(4)}
                  onMouseLeave={() => setHoveredArea3(null)}
                >
                </div>
                
                {/* 3-5.jpg */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isPage3ModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage2ModalOpen || isPage7ModalOpen || isPage8ModalOpen || isPage9ModalOpen || isPage10ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea3 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '6%',
                    width: '29%',
                    height: '25%'
                  }}
                  onClick={() => handlePage3AreaClick(5)}
                  onMouseEnter={() => setHoveredArea3(5)}
                  onMouseLeave={() => setHoveredArea3(null)}
                >
                </div>
                
                {/* 왼쪽 아래 3D 모델 영역 - 주석 처리 */}
                {/*
                <div 
                  className="absolute cursor-pointer hover:bg-blue-500/10 transition-all.duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '18.5%',
                    left: '5.5%',
                    width: '59%',
                    height: '22%'
                  }}
                  onClick={open3DModal}
                  title="3D 모델 확대 보기"
                >
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all.duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="text-white text-sm.font-medium bg-blue-600/80 px-3 py-1 rounded-full">
                      3D 모델 확대 보기
                    </div>
                  </div>
                </div>
                */}

                {/* 오른쪽 터치 영역 (3페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 4번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[3].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[3].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 4페이지 영역 6개 배치 (4-1, 4-2, 4-1-img, 4-2-img, 4-3-img, 4-4-img) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    left: '17%',
                    width: '74%',
                    height: '23%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(1)}
                  onMouseEnter={() => setHoveredArea4(1)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-1 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '24%',
                    left: '17%',
                    width: '74%',
                    height: '20%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(2)}
                  onMouseEnter={() => setHoveredArea4(2)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '33%',
                    left: '18%',
                    width: '37%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(3)}
                  onMouseEnter={() => setHoveredArea4(3)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-1-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '33%',
                    right: '5%',
                    width: '37%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(4)}
                  onMouseEnter={() => setHoveredArea4(4)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-2-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '4%',
                    left: '18%',
                    width: '37%',
                    height: '20%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(5)}
                  onMouseEnter={() => setHoveredArea4(5)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-3-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea4 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '4%',
                    right: '5%',
                    width: '37%',
                    height: '20%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage4AreaClick(6)}
                  onMouseEnter={() => setHoveredArea4(6)}
                  onMouseLeave={() => setHoveredArea4(null)}
                  title="4-4-img 팝업"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (4페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 5번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[4].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[4].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 5페이지 영역 6개 배치 (5-1, 5-2, 5-1-img, 5-2-img, 5-3-img, 5-4-img) */}
                {/* 기존 3D 모델 및 외장재 영역은 주석 처리 */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '74%',
                    height: '22%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(1)}
                  onMouseEnter={() => setHoveredArea5(1)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-1 팝업"
                >
                  {/* 기존 3D 모델 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(1)} - 3D 모델 모달 */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '23%',
                    left: '5%',
                    width: '74%',
                    height: '21%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(2)}
                  onMouseEnter={() => setHoveredArea5(2)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-2 팝업"
                >
                  {/* 기존 모달 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(2)} - 모달 */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '33%',
                    left: '5%',
                    width: '37%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(3)}
                  onMouseEnter={() => setHoveredArea5(3)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-1-img 팝업"
                >
                  {/* 기존 외장재 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(3)} - 외장재 모달 */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '33%',
                    right: '18%',
                    width: '37%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(4)}
                  onMouseEnter={() => setHoveredArea5(4)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-2-img 팝업"
                >
                  {/* 기존 외장재 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(4)} - 외장재 모달 */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '5%',
                    width: '37%',
                    height: '18%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(5)}
                  onMouseEnter={() => setHoveredArea5(5)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-3-img 팝업"
                >
                  {/* 기존 외장재 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(5)} - 외장재 모달 */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea5 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '18%',
                    width: '37%',
                    height: '18%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage5AreaClick(6)}
                  onMouseEnter={() => setHoveredArea5(6)}
                  onMouseLeave={() => setHoveredArea5(null)}
                  title="5-4-img 팝업"
                >
                  {/* 기존 외장재 영역 주석 처리 */}
                  {/* onClick={() => handlePage5AreaClick(6)} - 외장재 모달 */}
                </div>
                
                {/* 오른쪽 터치 영역 (5페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 6번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[5].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[5].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 6페이지 7개 영역 배치 (6-1, 6-2, 6-3, 6-4, 6-1-img, 6-2-img, 6-3-img) */}
                {/* GIF 관련 코드는 주석 처리 */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '6%',
                    width: '82%',
                    height: '9%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(1)}
                  onMouseEnter={() => setHoveredArea6(1)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-1 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 1 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/L-Bracket-고정-1114.gif"
                      alt="L-Bracket 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '31%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(2)}
                  onMouseEnter={() => setHoveredArea6(2)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-2 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 2 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/단열재-끼우기_1114.gif"
                      alt="단열재 끼우기"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '52%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(3)}
                  onMouseEnter={() => setHoveredArea6(3)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-3 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 3 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/화스너-고정-Trim_1114.gif"
                      alt="화스너 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '8%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(4)}
                  onMouseEnter={() => setHoveredArea6(4)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-4 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 4 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/수직-L-Bar-고정_1114.gif"
                      alt="수직 L-Bar 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '31%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(5)}
                  onMouseEnter={() => setHoveredArea6(5)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-1-img 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 5 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/수평-Bar-고정-Trim_1114.gif"
                      alt="수평 Bar 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '52%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(6)}
                  onMouseEnter={() => setHoveredArea6(6)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-2-img 팝업"
                >
                  {/* GIF 관련 코드 주석 처리 */}
                  {/* {hoveredArea6 === 6 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/마감재-부착-Trim_1114.gif"
                      alt="마감재 부착"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage63DModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea6 === 7 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '8%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage6AreaClick(7)}
                  onMouseEnter={() => setHoveredArea6(7)}
                  onMouseLeave={() => setHoveredArea6(null)}
                  title="6-3-img 팝업"
                >
                  {/* 유튜브 링크는 주석 처리 */}
                  {/* onClick={() => window.open('https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos', '_blank')} */}
                </div>
                
                {/* 왼쪽 터치 영역 (6페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 7번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[6].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[6].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 7페이지 7개 영역 배치 (7-1, 7-2, 7-3, 7-4, 7-1-img, 7-2-img, 7-3-img) */}
                {/* 영상 관련 코드는 주석 처리 */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '6%',
                    width: '82%',
                    height: '9%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(1)}
                  onMouseEnter={() => setHoveredArea7(1)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-1 팝업"
                >
                  {/* 영상 관련 코드 주석 처리 */}
                  {/* {!showVideo && (
                    <div className="absolute inset-0 rounded-lg">
                      <img
                        src="/IsoverFile/Interacive/video/액션캡 영상 이미지.png"
                        alt="액션캠 영상 이미지"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {showVideo && (
                    <div className="absolute inset-0 rounded-lg">
                      <video
                        className="w-full h-full object-cover rounded-lg"
                        controls
                        autoPlay
                        onEnded={closeVideo}
                      >
                        <source src="/IsoverFile/Interacive/video/Isover_목업시공 액션캠.mp4" type="video/mp4" />
                        영상을 재생할 수 없습니다.
                      </video>
                    </div>
                  )} */}
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '31%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(2)}
                  onMouseEnter={() => setHoveredArea7(2)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '52%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(3)}
                  onMouseEnter={() => setHoveredArea7(3)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-3 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '8%',
                    right: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(4)}
                  onMouseEnter={() => setHoveredArea7(4)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-4 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '31%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(5)}
                  onMouseEnter={() => setHoveredArea7(5)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-1-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '52%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(6)}
                  onMouseEnter={() => setHoveredArea7(6)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-2-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage7ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea7 === 7 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '8%',
                    left: '6%',
                    width: '43%',
                    height: '19%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage7AreaClick(7)}
                  onMouseEnter={() => setHoveredArea7(7)}
                  onMouseLeave={() => setHoveredArea7(null)}
                  title="7-3-img 팝업"
                >
                </div>
                
                {/* 오른쪽 터치 영역 (7페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 8번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[7].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[7].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 8페이지 4개 영역 배치 (8-1, 8-2, 8-3, 8-1-img) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage8ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea8 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '26%',
                    left: '6%',
                    width: '43%',
                    height: '21%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage8AreaClick(1)}
                  onMouseEnter={() => setHoveredArea8(1)}
                  onMouseLeave={() => setHoveredArea8(null)}
                  title="8-1 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage8ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea8 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '6%',
                    width: '43%',
                    height: '21%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage8AreaClick(2)}
                  onMouseEnter={() => setHoveredArea8(2)}
                  onMouseLeave={() => setHoveredArea8(null)}
                  title="8-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage8ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea8 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '6%',
                    width: '43%',
                    height: '21%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage8AreaClick(3)}
                  onMouseEnter={() => setHoveredArea8(3)}
                  onMouseLeave={() => setHoveredArea8(null)}
                  title="8-3 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage8ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea8 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '14%',
                    right: '6%',
                    width: '40%',
                    height: '35%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage8AreaClick(4)}
                  onMouseEnter={() => setHoveredArea8(4)}
                  onMouseLeave={() => setHoveredArea8(null)}
                  title="8-1-img 팝업"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (8페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 9번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[8].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[8].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 9페이지 4개 영역 배치 (9-1, 9-2, 9-3, 9-4) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage9ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea9 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '13%',
                    left: '6%',
                    width: '80%',
                    height: '10%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage9AreaClick(1)}
                  onMouseEnter={() => setHoveredArea9(1)}
                  onMouseLeave={() => setHoveredArea9(null)}
                  title="9-1 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage9ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea9 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '24%',
                    left: '6%',
                    width: '87%',
                    height: '26%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage9AreaClick(2)}
                  onMouseEnter={() => setHoveredArea9(2)}
                  onMouseLeave={() => setHoveredArea9(null)}
                  title="9-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage9ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea9 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '53%',
                    left: '6%',
                    width: '80%',
                    height: '18%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage9AreaClick(3)}
                  onMouseEnter={() => setHoveredArea9(3)}
                  onMouseLeave={() => setHoveredArea9(null)}
                  title="9-3 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage9ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea9 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '74%',
                    left: '6%',
                    width: '80%',
                    height: '21%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage9AreaClick(4)}
                  onMouseEnter={() => setHoveredArea9(4)}
                  onMouseLeave={() => setHoveredArea9(null)}
                  title="9-4 팝업"
                >
                </div>
                
                {/* 오른쪽 터치 영역 (9페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 10번째 페이지 */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[9].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[9].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 10페이지 6개 영역 배치 (10-1, 10-2, 10-1-img, 10-2-img, 10-3-img, 10-4-img) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '13%',
                    left: '6%',
                    width: '80%',
                    height: '10%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(1)}
                  onMouseEnter={() => setHoveredArea10(1)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-1 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 2 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '28%',
                    left: '6%',
                    width: '80%',
                    height: '17%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(2)}
                  onMouseEnter={() => setHoveredArea10(2)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-2 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 3 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '5%',
                    width: '45%',
                    height: '22%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(3)}
                  onMouseEnter={() => setHoveredArea10(3)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-1-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 4 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '5%',
                    width: '45%',
                    height: '22%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(4)}
                  onMouseEnter={() => setHoveredArea10(4)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-2-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 5 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '6%',
                    left: '5%',
                    width: '45%',
                    height: '22%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(5)}
                  onMouseEnter={() => setHoveredArea10(5)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-3-img 팝업"
                >
                </div>
                
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage10ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea10 === 6 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '6%',
                    right: '5%',
                    width: '45%',
                    height: '22%'
                  }}
                  data-clickable="true"
                  onClick={() => handlePage10AreaClick(6)}
                  onMouseEnter={() => setHoveredArea10(6)}
                  onMouseLeave={() => setHoveredArea10(null)}
                  title="10-4-img 팝업"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (10페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 11번째 페이지 (마지막 페이지) */}
            <div 
              className="page shadow-lg overflow-hidden" 
              key={pageData[10].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[10].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 11페이지 1개 영역 배치 (11-1) */}
                <div 
                  className={`absolute cursor-pointer rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || isPage11ModalOpen) ? 'pointer-events-none' : ''} ${hoveredArea11 === 1 ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '25%',
                    width: '35%',
                    height: '30%'
                  }}
                  data-clickable="true"
                  onClick={handlePage11AreaClick}
                  onMouseEnter={() => setHoveredArea11(1)}
                  onMouseLeave={() => setHoveredArea11(null)}
                  title="11-1 팝업"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (11페이지는 왼쪽, 마지막 페이지) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>
            </HTMLFlipBook>
            </div>
          </div>

           {/* 오른쪽 네비게이션 버튼들 */}
           <div className="flex flex-col items-center gap-2">
             {/* Right 버튼 */}
             <button
               onClick={goToNextPage}
               className={`transition-transform duration-200 ${isLastPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title={isLastPage ? "마지막 페이지입니다" : "다음 페이지"}
               disabled={isLastPage}
             >
               <img
                 src="/IsoverFile/Interacive/arrow_right.svg"
                 alt="다음 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
             
             {/* Last 버튼 */}
             <button
               onClick={goToLastPage}
               className={`transition-transform duration-200 ${isLastPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title={isLastPage ? "이미 마지막 페이지입니다" : "마지막 페이지"}
               disabled={isLastPage}
             >
               <img
                 src="/IsoverFile/Interacive/arrow_last.svg"
                 alt="마지막 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
           </div>
        </div>
      </div>


      {/* 오른쪽 툴바 - 데스크톱 (1450px 초과) - 주석처리됨 */}
      {/* {!isSmallScreen && (
        <div className="flex flex-shrink-0 w-[4%] min-w-[40px] max-w-[60px] flex-col gap-3 bg-gray-800 p-3 items-center relative z-50">
        <button
          onClick={() => (window.location.href = '/Isover')}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="홈"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        <button
          onClick={handlePrintClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="프린트"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>

        <button
          onClick={handleDownloadClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="PDF 다운로드"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        <button
          onClick={handleTocClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="목차"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={handleShareClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="공유"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>

        <button
          onClick={handleZoomIn}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="확대"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="축소"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>

        {isZoomed && (
          <button
            onClick={handleZoomReset}
            className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="원본 크기로 복원"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        </div>
      )} */}

      {/* 하단 툴바 - 모든 화면 크기에서 표시 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 p-3">
        <div className="flex justify-center items-center gap-4">
          {/* 홈 버튼 */}
          <button
            onClick={() => (window.location.href = '/Isover')}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="홈"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          {/* 프린터 버튼 */}
          <button
            onClick={handlePrintClick}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="프린트"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>

          {/* PDF 다운로드 버튼 */}
          <button
            onClick={handleDownloadClick}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="PDF 다운로드"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          {/* 목차 버튼 */}
          <button
            onClick={handleTocClick}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="목차"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          
          {/* 공유 버튼 */}
          <button
            onClick={handleShareClick}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="공유"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>

        </div>
        </div>


      {/* 3페이지 모달 */}
      {isModalOpen && selectedArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center relative">
              <img
                src={`/IsoverFile/Popup/${selectedArea}.png`}
                alt={`영역 ${selectedArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // PNG가 없으면 JPG 시도
                  if (e.target.src.includes('.png')) {
                    e.target.src = `/IsoverFile/Popup/${selectedArea}.jpg`;
                  } else {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              
              {/* 4번째 영역에 추가 영역 배치 */}
              {selectedArea === 4 && (
                <div 
                  className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '3-4-1' ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    top: '32%',
                    left: '15%',
                    width: '24%',
                    height: '64%'
                  }}
                  onClick={() => openImageModal('3-4-1')}
                  onMouseEnter={() => setHoveredModalArea('3-4-1')}
                  onMouseLeave={() => setHoveredModalArea(null)}
                  title="3-4-1, 3-4-2 이미지 보기"
                >
                </div>
              )}
              
              {/* 6번째 영역에 추가 영역 배치 */}
              {selectedArea === 6 && (
                <div 
                  className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '3-6-1' ? 'border-2 border-yellow-500' : ''}`}
                  style={{
                    bottom: '12%',
                    left: '12%',
                    width: '22%',
                    height: '55%'
                  }}
                  onClick={() => openImageModal('3-6-1')}
                  onMouseEnter={() => setHoveredModalArea('3-6-1')}
                  onMouseLeave={() => setHoveredModalArea(null)}
                  title="3-6-1 이미지 보기"
                >
                </div>
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
                        height: '16%'
                      }}
                    >
                      <Frender3DModel 
                        isVisible={true} 
                        opacity={1}
                        scale={1}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/IsoverFile/3dmodel/BlackFacing_test.glb"
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
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedArea}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 추가 4개 영역 모달 */}
      {isAdditionalModalOpen && selectedAdditionalArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeAdditionalModal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeAdditionalModal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={`/IsoverFile/Popup/pae_3-${selectedAdditionalArea - 6}.png`}
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
                    <>
                      <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                        <Frender3DModel 
                          isVisible={true} 
                          opacity={1}
                          scale={1}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/L-Bar.glb"
                          // modelPath="/IsoverFile/3dmodel/face-rig-anims-opt.glb"
                          isModal={true}
                          cameraPosition={[8, 14, 14]}
                          cameraFov={20}
                          customScale={1}
                        />
                      </div>
                      {/* 오른쪽 추가 영역 */}
                      <div 
                        className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '7-right' ? 'border-2 border-yellow-500' : ''}`}
                        style={{
                          top: '18%',
                          right: '5%',
                          width: '19.5%',
                          height: '62%'
                        }}
                        onClick={() => {
                          openAdditionalImageModal('pae_3-1');
                        }}
                        onMouseEnter={() => setHoveredModalArea('7-right')}
                        onMouseLeave={() => setHoveredModalArea(null)}
                      >
                      </div>
                    </>
                  )}
                  
                  {selectedAdditionalArea === 8 && (
                    <>
                      <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                        <Frender3DModel 
                          isVisible={true} 
                          opacity={1}
                          scale={0.7}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/L-AnkerBracket.glb"
                          isModal={true}
                          cameraPosition={[4, 4, 8]}
                          cameraFov={30}
                          customScale={0.3}
                        />
                      </div>
                      {/* 오른쪽 추가 영역 */}
                      <div 
                        className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '8-right' ? 'border-2 border-yellow-500' : ''}`}
                        style={{
                          top: '16%',
                          right: '5%',
                          width: '19%',
                          height: '54%'
                        }}
                        onClick={() => {
                          openAdditionalImageModal('pae_3-2');
                        }}
                        onMouseEnter={() => setHoveredModalArea('8-right')}
                        onMouseLeave={() => setHoveredModalArea(null)}
                      >
                      </div>
                    </>
                  )}
                  
                  {selectedAdditionalArea === 9 && (
                    <>
                      <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                        <Frender3DModel 
                          isVisible={true} 
                          opacity={1}
                          scale={0.7}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/L-HBar.glb"
                          isModal={true}
                          cameraPosition={[-10, 10, 20]}
                          cameraFov={40}
                          customScale={0.3}
                        />
                      </div>
                      {/* 오른쪽 추가 영역 */}
                      <div 
                        className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '9-right' ? 'border-2 border-yellow-500' : ''}`}
                        style={{
                          top: '26%',
                          right: '5%',
                          width: '19.5%',
                          height: '50%'
                        }}
                        onClick={() => {
                          openAdditionalImageModal('pae_3-3');
                        }}
                        onMouseEnter={() => setHoveredModalArea('9-right')}
                        onMouseLeave={() => setHoveredModalArea(null)}
                      >
                      </div>
                    </>
                  )}
                  
                  {selectedAdditionalArea === 10 && (
                    <>
                      <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                        <Frender3DModel 
                          isVisible={true} 
                          opacity={1}
                          scale={1}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/L-Holder.glb"
                          isModal={true}
                          cameraPosition={[1, 2, 2]}
                          cameraFov={30}
                          customScale={0.3}
                        />
                      </div>
                      {/* 오른쪽 추가 영역 */}
                      <div 
                        className={`absolute cursor-pointer rounded-lg ${hoveredModalArea === '10-right' ? 'border-2 border-yellow-500' : ''}`}
                        style={{
                          top: '21%',
                          right: '5%',
                          width: '19%',
                          height: '64%'
                        }}
                        onClick={() => {
                          openAdditionalImageModal('pae_3-4');
                        }}
                        onMouseEnter={() => setHoveredModalArea('10-right')}
                        onMouseLeave={() => setHoveredModalArea(null)}
                      >
                      </div>
                    </>
                  )}
                  
                  {/* {selectedAdditionalArea === 11 && (
                    <div className="absolute top-[20%] left-[5%] w-[58%] h-[21%]">
                    <Frender3DModel 
                      isVisible={true} 
                      opacity={0.9}
                      scale={0.8}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/Untitled.glb"
                      isModal={true}
                    />
                  </div>
                  )} */}
                </div>
              </div>
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/pae_3-{selectedAdditionalArea - 6}.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 모달 */}
      {isPage4ModalOpen && selectedPage4Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage4Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage4Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 팝업 콘텐츠 */}
            <div className="relative flex items-center justify-center w-full">
              {selectedPage4Area === 3 ? (
                <div className="w-full space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-semibold text-gray-900">드론 학습 콘텐츠</p>
                    <p className="text-sm text-gray-600">이론부터 실습, 트랙 주행까지 이어지는 7편의 플레이리스트입니다.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DRONE_VIDEO_PLAYLIST.map((video, index) => {
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
                    src={`/FrienderFile/Popup/${
                      selectedPage4Area === 1 ? '4-1.jpg' :
                      selectedPage4Area === 2 ? '4-2.jpg' :
                      selectedPage4Area === 4 ? '4-2-img.jpg' :
                      selectedPage4Area === 5 ? '4-3-img.jpg' :
                      selectedPage4Area === 6 ? '4-4-img.jpg' :
                      '4-1.jpg'
                    }`}
                    alt={`4-${selectedPage4Area} 팝업`}
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
                    <p>이미지를 불러올 수 없습니다.</p>
                    <p className="text-sm">경로: /FrienderFile/Popup/4-{selectedPage4Area}.jpg</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 영역 2번 전용 모달 (테스트용) */}
      {isPage4Area2ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage4Area2Modal}
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
                src="/IsoverFile/Popup/4-2.png"
                alt="영역 2 (테스트용)"
                className="max-w-full  min-h-[40vh] max-h-[75vh] object-contain rounded-lg shadow-lg"
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/4-2.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 모달 */}
      {isPage5ModalOpen && selectedPage5Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage5Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage5Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/${
                  selectedPage5Area === 1 ? '5-1.jpg' :
                  selectedPage5Area === 2 ? '5-2.jpg' :
                  selectedPage5Area === 3 ? '5-1-img.jpg' :
                  selectedPage5Area === 4 ? '5-2-img.jpg' :
                  selectedPage5Area === 5 ? '5-3-img.jpg' :
                  selectedPage5Area === 6 ? '5-4-img.jpg' :
                  '5-1.jpg'
                }`}
                alt={`5-${selectedPage5Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /FrienderFile/Popup/5-{selectedPage5Area}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 6페이지 모달 */}
      {isPage6ModalOpen && selectedPage6Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage6Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage6Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 팝업 이미지 또는 GIF 표시 */}
            <div className="flex items-center justify-center w-full">
              {page6MediaOverride ? (
                <img
                  src={page6MediaOverride.src}
                  alt={page6MediaOverride.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  style={{
                    width: 'auto',
                    height: 'auto',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <img
                  src={`/FrienderFile/Popup/${
                    selectedPage6Area === 1 ? '6-1.jpg' :
                    selectedPage6Area === 2 ? '6-2.jpg' :
                    selectedPage6Area === 3 ? '6-3.jpg' :
                    selectedPage6Area === 4 ? '6-4.jpg' :
                    selectedPage6Area === 5 ? '6-1-img.jpg' :
                    selectedPage6Area === 6 ? '6-2-img.jpg' :
                    selectedPage6Area === 7 ? '6-3-img.jpg' :
                    '6-1.jpg'
                  }`}
                  alt={`영역 ${selectedPage6Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">
                  {page6MediaOverride
                    ? `경로: ${page6MediaOverride.src}`
                    : `영역 ${selectedPage6Area}의 팝업 파일을 찾을 수 없습니다.`}
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
                <Frender3DModel 
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
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
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

      {/* 2페이지 모달 */}
      {isPage2ModalOpen && selectedPage2Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage2Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage2Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/2-${selectedPage2Area}.jpg`}
                alt={`2-${selectedPage2Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
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
          onClick={closePage3Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage3Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/${
                  selectedPage3Area === 1 ? '3-1.jpg' :
                  selectedPage3Area === 2 ? '3-2.jpg' :
                  selectedPage3Area === 3 ? '3-3.png' :
                  selectedPage3Area === 4 ? '3-4.jpg' :
                  selectedPage3Area === 5 ? '3-5.jpg' :
                  '3-1.jpg'
                }`}
                alt={`3-${selectedPage3Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /FrienderFile/Popup/3-{selectedPage3Area}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7페이지 모달 */}
      {isPage7ModalOpen && selectedPage7Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage7Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage7Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
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
                  src={`/FrienderFile/Popup/${
                    selectedPage7Area === 1 ? '7-1.jpg' :
                    selectedPage7Area === 2 ? '7-2.jpg' :
                    selectedPage7Area === 3 ? '7-3.jpg' :
                    selectedPage7Area === 4 ? '7-4.jpg' :
                    selectedPage7Area === 5 ? '7-1-img.jpg' :
                    selectedPage7Area === 6 ? '7-2-img.jpg' :
                    selectedPage7Area === 7 ? '7-3-img.jpg' :
                    '7-1.jpg'
                  }`}
                  alt={`7-${selectedPage7Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">
                  {page7MediaOverride
                    ? `경로: ${page7MediaOverride.src}`
                    : `경로: /FrienderFile/Popup/7-${selectedPage7Area}.jpg`}
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
          onClick={closePage8Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage8Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/${
                  selectedPage8Area === 1 ? '8-1.jpg' :
                  selectedPage8Area === 2 ? '8-2.jpg' :
                  selectedPage8Area === 3 ? '8-3.jpg' :
                  selectedPage8Area === 4 ? '8-1-img.jpg' :
                  '8-1.jpg'
                }`}
                alt={`8-${selectedPage8Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
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
          onClick={closePage9Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage9Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/9-${selectedPage9Area}.jpg`}
                alt={`9-${selectedPage9Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
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
          onClick={closePage10Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage10Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/FrienderFile/Popup/${
                  selectedPage10Area === 1 ? '10-1.jpg' :
                  selectedPage10Area === 2 ? '10-2.jpg' :
                  selectedPage10Area === 3 ? '10-1-img.jpg' :
                  selectedPage10Area === 4 ? '10-2-img.jpg' :
                  selectedPage10Area === 5 ? '10-3-img.jpg' :
                  selectedPage10Area === 6 ? '10-4-img.jpg' :
                  '10-1.jpg'
                }`}
                alt={`10-${selectedPage10Area} 팝업`}
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
                <p>이미지를 불러올 수 없습니다.</p>
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
          onClick={closePage11Modal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePage11Modal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >
            {/* 팝업 이미지 + 네이버 지도 */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/FrienderFile/Popup/11-1.jpg"
                    alt="11-1 팝업"
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
                    <p>이미지를 불러올 수 없습니다.</p>
                    <p className="text-sm">경로: /FrienderFile/Popup/11-1.jpg</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="relative w-full min-h-[260px] h-[320px] lg:h-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                  <iframe
                    title="Friender 위치 안내 (네이버 지도)"
                    src={NAVER_MAP_EMBED_URL}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute bottom-3 right-3 bg-white/90 text-xs text-gray-700 px-3 py-1 rounded-full shadow">
                    네이버 지도
                  </div>
                </div>

                <div className="space-y-1 text-sm leading-relaxed text-gray-700">
                  <p className="text-base font-semibold text-gray-900">주소</p>
                  <p>{NAVER_MAP_ADDRESS}</p>
                  <p className="text-xs text-gray-500">
                    위도 {NAVER_MAP_COORDINATES.lat.toFixed(6)} · 경도 {NAVER_MAP_COORDINATES.lng.toFixed(6)}
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

      {/* 5페이지 3D 모델 모달창 */}
      {isPage53DModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => {
            setIsPage53DModalOpen(false);
            setCurrentPartModel(null);
            setSelectedPart(1);
            setIsPage53DModelLoading(false);
          }}
        >
          <div 
            className={`relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden ${currentPartModel ? 'p-0' : ''}`}
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
            <div className={`w-full relative ${!currentPartModel ? 'h-full pt-16 pb-20' : 'h-full pb-16'}`}>
              
              {/* 배경 이미지 - 파트 선택 시에만 표시 */}
              {currentPartModel && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`/IsoverFile/Popup/pae_5-${selectedPart}.png`}
                    alt={`5페이지 배경 이미지 ${selectedPart}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // PNG가 없으면 기본 이미지 사용
                      e.target.src = "/IsoverFile/Popup/5-2.png";
                    }}
                  />
                </div>
              )}
              
              {/* 파트 선택 안내 텍스트 */}
              {!currentPartModel && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-1">🎯 파트를 선택해보세요!</p>
                    <p className="text-sm text-gray-600">마우스로 회전하여 각 파트를 확인하고 클릭해보세요</p>
                  </div>
                </div>
              )}
              
              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className={`z-10 w-full h-full ${currentPartModel ? 'absolute inset-0' : 'relative'}`}>
                <Frender3DModel 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath={currentPartModel || "/IsoverFile/3dmodel/system_with_panel_test.glb"}
                  isModal={true}
                  cameraPosition={[3, -2, 8]} // 파트 모델링과 system_with_panel 분리
                  cameraFov={30}
                  customScale={currentPartModel ? getModelScaleByPart(selectedPart) : 0.3}
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
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
                {currentPartModel && (
                  <p className="text-sm text-blue-600 mb-2">선택된 파트: {getPartName(selectedPart)}</p>
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

      {/* 5페이지 외장재 모달창 */}
      {isPage5ExteriorModalOpen && selectedExteriorType && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closePage5ExteriorModal}
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
                  src={`/IsoverFile/Popup/pae_5-${selectedExteriorType - 2}.png`}
                  alt={`외장재 타입 ${selectedExteriorType} 배경 이미지`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // PNG가 없으면 기본 이미지 사용
                    e.target.src = "/IsoverFile/Popup/5-2.png";
                  }}
                />
              </div>
              
              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className="absolute inset-0 z-10 w-full h-full">
                <Frender3DModel 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath={getExteriorModelPath(selectedExteriorType)}
                  isModal={true}
                  cameraPosition={[3, -2, 8]}
                  cameraFov={20}
                  customScale={0.6}
                  rotateSpeed={1.0}
                  showWireframe={false}
                />
              </div>
            </div>
            
            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
                <p className="text-sm text-blue-600 mb-2">외장재 타입: {getExteriorTypeName(selectedExteriorType)}</p>
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

        </div>
      )}
      {/* 3페이지 이미지 모달창 */}
      {isImageModalOpen && selectedImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              {selectedImageType === '3-4-1' ? (
                // 3-4-1 타입일 때 두 이미지를 나란히 표시
                <div className="flex max-w-full max-h-[85vh]">
                  <img
                    src="/IsoverFile/Popup/3-4-2-Korean.jpg"
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
                  src={`/IsoverFile/Popup/${selectedImageType}.jpg`}
                  alt={`${selectedImageType} 이미지`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    // JPG가 없으면 PNG 시도
                    if (e.target.src.includes('.jpg')) {
                      e.target.src = `/IsoverFile/Popup/${selectedImageType}.png`;
                    } else {
                      // 이미지 로드 실패 시 메시지 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              )}
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedImageType}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 새로운 영역 모달창 */}
      {isNewAreaModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeNewAreaModal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNewAreaModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNewAreaModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isNewAreaModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewAreaModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
            {(newAreaModalDragOffset.x !== 0 || newAreaModalDragOffset.y !== 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewAreaModalPositionReset();
                }}
                className="w-12 h-12 bg-blue-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 rounded-full shadow-lg border border-blue-400 transition-colors duration-300 cursor-pointer"
                title="위치 리셋"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeNewAreaModal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto relative shadow-2xl ${isNewAreaModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${newAreaModalZoomLevel}) translate(${newAreaModalDragOffset.x}px, ${newAreaModalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isNewAreaModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleNewAreaModalDragStart}
            onMouseMove={isNewAreaModalDragging ? handleNewAreaModalDragMove : undefined}
            onMouseUp={isNewAreaModalDragging ? handleNewAreaModalDragEnd : undefined}
            onMouseLeave={isNewAreaModalDragging ? handleNewAreaModalDragEnd : undefined}
          >
            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src="/IsoverFile/Popup/top_3-1.png"
                alt="무용접 파사드 시스템"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
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
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/top_3-1.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 영역 이미지 모달창 */}
      {isAdditionalImageModalOpen && selectedAdditionalImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeAdditionalImageModal}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* 확대 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomIn();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="확대"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>

            {/* 축소 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalZoomOut();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
              title="축소"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* 확대/축소 리셋 버튼 */}
            {isModalZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalZoomReset();
                }}
                className="w-12 h-12 bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="원본 크기로 복원"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 위치 리셋 버튼 */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeAdditionalImageModal();
              }}
              className="w-12 h-12 bg-red-500/95 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 rounded-full shadow-lg border border-red-400 transition-colors duration-300 cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl ${isModalDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={isModalDragging ? handleModalDragMove : undefined}
            onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
            onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
          >

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              {selectedAdditionalImageType === 'pae_3-1' && (
                <img
                  src="/IsoverFile/Popup/pae_3-1_img.png"
                  alt="Additional Area 7 Image"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              {selectedAdditionalImageType === 'pae_3-2' && (
                <img
                  src="/IsoverFile/Popup/pae_3-2_img.png"
                  alt="Additional Area 8 Image"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              {selectedAdditionalImageType === 'pae_3-3' && (
                <img
                  src="/IsoverFile/Popup/pae_3-3_img.png"
                  alt="Additional Area 9 Image"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              {selectedAdditionalImageType === 'pae_3-4' && (
                <img
                  src="/IsoverFile/Popup/pae_3-4_img.png"
                  alt="Additional Area 10 Image"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedAdditionalImageType}_img.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogflow 챗봇 플로팅 버튼 */}
     <Chatbot />
    </div>
  );
}

export default FrienderPage;