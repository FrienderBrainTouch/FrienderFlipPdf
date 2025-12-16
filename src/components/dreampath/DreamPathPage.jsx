import React from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import DreamPathPageMobile from './DreamPathPage-mobile';
import { LANGUAGE_FOLDER_MAP } from '../../utils/language';
import { useValidLanguage } from '../../hooks/useValidLanguage';
import { useFlipBookSize } from '../../hooks/useFlipBookSize';

function DreamPathPage() {
  const navigate = useNavigate();
  const validLanguage = useValidLanguage();
  
  // 화면 크기 상태 관리
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1025);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth <= 1450);
  
  // 플립북 크기 계산
  const flipBookSize = useFlipBookSize();
  const flipBookRef = React.useRef(null);
  
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isCoverPage, setIsCoverPage] = React.useState(true);
  const [isFirstPage, setIsFirstPage] = React.useState(true);
  const [isLastPage, setIsLastPage] = React.useState(false);
  
  // 마우스 이벤트 활성화 상태 관리
  const [mouseEventsEnabled, setMouseEventsEnabled] = React.useState(false);
  
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
  
  // Popup 모달 상태 관리
  const [isPopupModalOpen, setIsPopupModalOpen] = React.useState(false);
  const [selectedPopupArea, setSelectedPopupArea] = React.useState(null);
  const [selectedPopupPage, setSelectedPopupPage] = React.useState(null);
  
  // 각 페이지별 호버 상태 관리
  const [hoveredPopupArea, setHoveredPopupArea] = React.useState(null);
  
  // 모달창 확대/축소 상태 관리
  const [modalZoomLevel, setModalZoomLevel] = React.useState(1);
  const [isModalZoomed, setIsModalZoomed] = React.useState(false);
  
  // 모달창 드래그 상태
  const [modalDragOffset, setModalDragOffset] = React.useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = React.useState(false);
  const modalDragStartRef = React.useRef({ x: 0, y: 0 });
  
  // DreamPath 페이지 데이터 (6페이지)
  // 경로 생성: 한국어는 루트, 다국어는 Multilingual 하위
  const pageData = React.useMemo(() => {
    const getPagePath = (pageNum) => {
      if (validLanguage === 'ko') {
        return `/DreamPath/Page/${pageNum}.svg`;
      }
      // 언어 코드를 폴더명으로 변환 (ja -> Japan, zh -> China 등)
      const folderName = LANGUAGE_FOLDER_MAP[validLanguage] || validLanguage;
      return `/DreamPath/Multilingual/${folderName}/Page/${pageNum}.svg`;
    };
    
    return [
      { id: 1, svg: getPagePath(1), isCover: true },
      { id: 2, svg: getPagePath(2) },
      { id: 3, svg: getPagePath(3) },
      { id: 4, svg: getPagePath(4) },
      { id: 5, svg: getPagePath(5) },
      { id: 6, svg: getPagePath(6) },
    ];
  }, [validLanguage]);
  
  // 화면 크기 변경 감지
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
      setIsSmallScreen(window.innerWidth <= 1450);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 로고 애니메이션 완료 후 화면 전환
  React.useEffect(() => {
    if (logoOpacity === 1) {
      setTimeout(() => {
        setWhiteScreenVisible(false);
        setTimeout(() => {
          setMainScreenVisible(true);
        }, 500);
      }, 500);
    }
  }, [logoOpacity]);
  
  // 로고 애니메이션 함수 (재사용 가능)
  const startLogoAnimation = React.useCallback(() => {
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
    
    setTimeout(() => {
      logoAnimation();
    }, 500);
  }, []);
  
  // 인트로 화면 애니메이션 시퀀스
  React.useEffect(() => {
    startLogoAnimation();
  }, [startLogoAnimation]);
  
  // 페이지 변경 이벤트 핸들러
  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    const firstPage = newPage === 0;
    const lastPage = newPage === pageData.length - 1;
    setIsFirstPage(firstPage);
    setIsLastPage(lastPage);
    setIsCoverPage(firstPage || lastPage);
    
    // 페이지 변경 시 확대/축소 상태 리셋
    setZoomLevel(1);
    setIsZoomed(false);
    setShowMinimap(false);
    setDragOffset({ x: 0, y: 0 });
  };
  
  /**
   * 홈 버튼 클릭 핸들러 - 인트로 화면 재시작 및 1페이지로 이동
   */
  const handleHomeClick = () => {
    // 인트로 화면 재시작
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);
    
    // 확대/축소 상태 리셋
    setZoomLevel(1);
    setIsZoomed(false);
    setShowMinimap(false);
    setDragOffset({ x: 0, y: 0 });
    
    // 1페이지로 이동
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(0);
    }
    
    // 페이지 상태 리셋
    setCurrentPage(0);
    setIsFirstPage(true);
    setIsLastPage(false);
    setIsCoverPage(true);
    
    // 로고 애니메이션 재시작
    startLogoAnimation();
  };
  
  /**
   * 프린터 버튼 클릭 핸들러
   */
  const handlePrintClick = () => {
    // DreamPath PDF가 있다면 사용, 없으면 현재 페이지 인쇄
    // 경로 생성: 한국어는 루트, 다국어는 Multilingual 하위
    let pdfUrl;
    if (validLanguage === 'ko') {
      pdfUrl = `/DreamPath/DreamPath-Pdf/한국어.pdf`;
    } else {
      const folderName = LANGUAGE_FOLDER_MAP[validLanguage] || validLanguage;
      pdfUrl = `/DreamPath/Multilingual/${folderName}/DreamPath-Pdf/dreampath-${validLanguage}.pdf`;
    }
    const pdfWindow = window.open(pdfUrl, '_blank');
    if (pdfWindow) {
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    } else {
      // PDF가 없으면 현재 페이지 인쇄
      window.print();
    }
  };
  
  /**
   * PDF 다운로드 버튼 클릭 핸들러
   */
  const handleDownloadClick = () => {
    // 경로 생성: 한국어는 루트, 다국어는 Multilingual 하위
    let pdfUrl, pdfFileName;
    if (validLanguage === 'ko') {
      pdfUrl = `/DreamPath/DreamPath-Pdf/한국어.pdf`;
      pdfFileName = 'dreampath-ko.pdf';
    } else {
      const folderName = LANGUAGE_FOLDER_MAP[validLanguage] || validLanguage;
      pdfUrl = `/DreamPath/Multilingual/${folderName}/DreamPath-Pdf/dreampath-${validLanguage}.pdf`;
      pdfFileName = `dreampath-${validLanguage}.pdf`;
    }
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfFileName;
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
          title: 'DreamPath',
          text: 'DreamPath에 대해 확인해보세요!',
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
      flipBookRef.current.pageFlip().turnToPage(1); // 2번째 페이지로 이동
    }
  };
  
  /**
   * 확대 버튼 클릭 핸들러
   */
  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 0.2, 2);
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel !== 1);
    setShowMinimap(newZoomLevel > 1);
    if (newZoomLevel > 1) {
      setDragOffset({ x: 0, y: 0 });
    }
  };
  
  /**
   * 축소 버튼 클릭 핸들러
   */
  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 0.2, 0.5);
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel !== 1);
    setShowMinimap(newZoomLevel > 1);
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
    setShowMinimap(false);
    setDragOffset({ x: 0, y: 0 });
  };
  
  // 드래그 핸들러들
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setDragOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // 터치 영역 핸들러
  const handleTouchAreaMouseDown = (direction) => {
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };
  
  const handleTouchAreaMouseUp = () => {
    // 필요시 추가 로직
  };
  
  const handleTouchAreaTouchStart = (direction) => {
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };
  
  const handleTouchAreaTouchEnd = () => {
    // 필요시 추가 로직
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
  
  /**
   * Popup 영역 클릭 핸들러
   * @param {number} pageNumber - 페이지 번호 (1-6)
   * @param {string} areaId - 영역 ID (예: '표지_03', '수업흐름_03' 등)
   */
  const handlePopupAreaClick = (pageNumber, areaId) => {
    // 모달 열기 전에 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
    
    setSelectedPopupPage(pageNumber);
    setSelectedPopupArea(areaId);
    setIsPopupModalOpen(true);
  };
  
  /**
   * Popup 모달 닫기 핸들러
   */
  const closePopupModal = () => {
    setIsPopupModalOpen(false);
    setSelectedPopupArea(null);
    setSelectedPopupPage(null);
    // 모달창 확대/축소 상태 리셋
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    // 모달창 드래그 상태 리셋
    setModalDragOffset({ x: 0, y: 0 });
    setIsModalDragging(false);
    modalDragStartRef.current = { x: 0, y: 0 };
  };
  
  /**
   * 모달 확대 버튼 클릭 핸들러
   */
  const handleModalZoomIn = () => {
    const newZoomLevel = Math.min(modalZoomLevel + 0.2, 3);
    setModalZoomLevel(newZoomLevel);
    setIsModalZoomed(newZoomLevel !== 1);
  };
  
  /**
   * 모달 축소 버튼 클릭 핸들러
   */
  const handleModalZoomOut = () => {
    const newZoomLevel = Math.max(modalZoomLevel - 0.2, 0.5);
    setModalZoomLevel(newZoomLevel);
    setIsModalZoomed(newZoomLevel !== 1);
  };
  
  /**
   * 모달 확대/축소 리셋 핸들러
   */
  const handleModalZoomReset = () => {
    setModalZoomLevel(1);
    setIsModalZoomed(false);
    setModalDragOffset({ x: 0, y: 0 });
  };
  
  // 모달 드래그 핸들러들
  const handleModalDragStart = (e) => {
    setIsModalDragging(true);
    modalDragStartRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };
  
  const handleModalDragMove = (e) => {
    if (isModalDragging) {
      const deltaX = e.clientX - modalDragStartRef.current.x;
      const deltaY = e.clientY - modalDragStartRef.current.y;
      
      setModalDragOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      
      modalDragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleModalDragEnd = () => {
    setIsModalDragging(false);
  };
  
  /**
   * Popup 이미지 경로 생성 함수
   * @param {string} areaId - 영역 ID (예: '표지_03')
   * @returns {string} 이미지 경로 (한글 파일명 그대로 사용)
   *
   * 브라우저가 필요한 경우 자동으로 인코딩하므로 여기서는 인코딩하지 않습니다.
   */
  const getPopupImagePath = (areaId) => {
    if (validLanguage === 'ko') {
      return `/DreamPath/Popup/${areaId}.png`;
    }
    const folderName = LANGUAGE_FOLDER_MAP[validLanguage] || validLanguage;
    return `/DreamPath/Multilingual/${folderName}/Popup/${areaId}.png`;
  };
  
  // 모바일 화면인 경우 모바일 컴포넌트 렌더링
  if (isMobile) {
    return <DreamPathPageMobile language={validLanguage} />;
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
                          backgroundImage: `url(${pageData[0]?.svg})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
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
                            backgroundPosition: 'right center',
                          }}
                        />
                        {/* 오른쪽 페이지 */}
                        <div 
                          className="w-1/2 h-full bg-cover bg-center bg-no-repeat opacity-30"
                          style={{
                            backgroundImage: `url(${
                              pageData[currentPage + 1]?.svg || pageData[currentPage]?.svg
                            })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'left center',
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
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 중앙 플립북 컨테이너 */}
          <div className="w-full h-full flex items-center justify-center p-4 relative">
            {/* 돋보기 버튼들 - 플립북 컨테이너 위에 배치 */}
            <div className="absolute top-18 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
              {/* 확대 버튼 */}
              <button
                onClick={handleZoomIn}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="확대"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>
              
              {/* 축소 버튼 */}
              <button
                onClick={handleZoomOut}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:text-gray-900 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
                title="축소"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex items-center xl:gap-4">
              {/* 왼쪽 네비게이션 버튼들 */}
              <div className="flex flex-col items-center gap-2">
                {/* Left 버튼 */}
                <button
                  onClick={goToPreviousPage}
                  className={`transition-transform duration-200 ${
                    isFirstPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  }`}
                  style={{ width: '48px', height: '48px', padding: '8px' }}
                  title={isFirstPage ? '첫 페이지입니다' : '이전 페이지'}
                  disabled={isFirstPage}
                >
                  <img
                    src="/FrienderFile/Interactive/arrow_left.svg"
                    alt="이전 페이지"
                    style={{ width: '32px', height: '32px' }}
                  />
                </button>
                {/* First 버튼 */}
                <button
                  onClick={goToFirstPage}
                  className={`transition-transform duration-200 ${
                    isFirstPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  }`}
                  style={{ width: '48px', height: '48px', padding: '8px' }}
                  title={isFirstPage ? '이미 첫 페이지입니다' : '첫 페이지'}
                  disabled={isFirstPage}
                >
                  <img
                    src="/FrienderFile/Interactive/arrow_first.svg"
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
                  className={`${isZoomed ? 'cursor-grab' : ''} ${
                    isDragging ? 'cursor-grabbing' : ''
                  }`}
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                    boxShadow: `
                      0 -20px 40px -10px rgba(0, 0, 0, 0.3),
                      0 20px 40px -10px rgba(0, 0, 0, 0.3),
                      -20px 0 40px -10px rgba(0, 0, 0, 0.3),
                      20px 0 40px -10px rgba(0, 0, 0, 0.3)
                    `,
                  }}
                >
                  <HTMLFlipBook 
                    ref={flipBookRef}
                    width={flipBookSize.width} 
                    height={flipBookSize.height}
                    maxShadowOpacity={0}
                    drawShadow={false}
                    showCover={true}
                    size="fixed"
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
                          backgroundImage: `url(${pageData[0].svg})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {/* ========== 1페이지 Popup 클릭 영역 (총 3개) ========== */}
                        {/* 1페이지 - 박스 1/3 - 표지_03.png */}
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          } ${hoveredPopupArea === '1-1' ? 'border-2 border-yellow-500' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '55%',
                            left: '7%',
                            width: '82%',
                            height: '5%',
                          }}
                          onClick={() => handlePopupAreaClick(1, '1-1')}
                          onMouseEnter={() => setHoveredPopupArea('1-1')}
                          onMouseLeave={() => setHoveredPopupArea(null)}
                          title="1페이지 박스 1/3 - 표지_03"
                        ></div>
                        
                        {/* 1페이지 - 박스 2/3 - 표지_05.png */}
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          } ${hoveredPopupArea === '1-2' ? 'border-2 border-yellow-500' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '60%',
                            left: '7%',
                            width: '74%',
                            height: '10%',
                          }}
                          onClick={() => handlePopupAreaClick(1, '1-2')}
                          onMouseEnter={() => setHoveredPopupArea('1-2')}
                          onMouseLeave={() => setHoveredPopupArea(null)}
                          title="1페이지 박스 2/3 - 표지_05"
                        ></div>
                        
                        {/* 1페이지 - 박스 3/3 - 표지_08.png */}
                        <div 
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          } ${hoveredPopupArea === '1-3' ? 'border-2 border-yellow-500' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '4%',
                            right: '16%',
                            width: '78%',
                            height: '15%',
                          }}
                          onClick={() => handlePopupAreaClick(1, '1-3')}
                          onMouseEnter={() => setHoveredPopupArea('1-3')}
                          onMouseLeave={() => setHoveredPopupArea(null)}
                          title="1페이지 박스 3/3 - 표지_08"
                        ></div>
                        
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
                    
                    {/* 나머지 페이지들 */}
                    {pageData.slice(1).map((page, index) => (
                      <div 
                        className="page shadow-lg overflow-hidden" 
                        key={page.id}
                        data-density="hard"
                      >
                        <div 
                          className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                          style={{
                            backgroundImage: `url(${page.svg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          {/* ========== 2페이지 Popup 클릭 영역 (총 6개) ========== */}
                          {page.id === 2 && (
                            <>
                              {/* 2페이지 - 박스 1/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-1' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '4%',
                                  left: '61%',
                                  width: '34%',
                                  height: '13%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-1')}
                                onMouseEnter={() => setHoveredPopupArea('2-1')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 1/6 - 수업흐름_03"
                              ></div>
                              
                              {/* 2페이지 - 박스 2/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-2' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '18%',
                                  left: '61%',
                                  width: '34%',
                                  height: '12%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-2')}
                                onMouseEnter={() => setHoveredPopupArea('2-2')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 2/6 - 수업흐름_07"
                              ></div>
                              
                              {/* 2페이지 - 박스 3/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-3' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '32%',
                                  left: '61%',
                                  width: '35%',
                                  height: '11%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-3')}
                                onMouseEnter={() => setHoveredPopupArea('2-3')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 3/6 - 수업흐름_10"
                              ></div>
                              
                              {/* 2페이지 - 박스 4/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-4' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '68%',
                                  left: '9%',
                                  width: '25%',
                                  height: '10%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-4')}
                                onMouseEnter={() => setHoveredPopupArea('2-4')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 4/6 - 수업흐름_12"
                              ></div>
                              
                              {/* 2페이지 - 박스 5/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-5' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '68%',
                                  left: '38%',
                                  width: '24%',
                                  height: '10%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-5')}
                                onMouseEnter={() => setHoveredPopupArea('2-5')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 5/6 - 2-5"
                              ></div>
                              
                              {/* 2페이지 - 박스 6/6 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '2-6' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '68%',
                                  left: '67%',
                                  width: '25%',
                                  height: '10%',
                                }}
                                onClick={() => handlePopupAreaClick(2, '2-6')}
                                onMouseEnter={() => setHoveredPopupArea('2-6')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="2페이지 박스 6/6 - 2-6"
                              ></div>
                            </>
                          )}
                          
                          {/* ========== 3페이지 Popup 클릭 영역 (총 4개) ========== */}
                          {page.id === 3 && (
                            <>
                              {/* 3페이지 - 박스 1/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '3-1' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '9%',
                                  left: '7%',
                                  width: '91%',
                                  height: '10%',
                                }}
                                onClick={() => handlePopupAreaClick(3, '3-1')}
                                onMouseEnter={() => setHoveredPopupArea('3-1')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="3페이지 박스 1/4 - 수업흐름_19"
                              ></div>
                              
                              {/* 3페이지 - 박스 2/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '3-2' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '35%',
                                  left: '8%',
                                  width: '26%',
                                  height: '12%',
                                }}
                                onClick={() => handlePopupAreaClick(3, '3-2')}
                                onMouseEnter={() => setHoveredPopupArea('3-2')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="3페이지 박스 2/4 - 수업흐름_22"
                              ></div>
                              
                              {/* 3페이지 - 박스 3/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '3-3' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '52%',
                                  left: '38%',
                                  width: '24%',
                                  height: '13%',
                                }}
                                onClick={() => handlePopupAreaClick(3, '3-3')}
                                onMouseEnter={() => setHoveredPopupArea('3-3')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="3페이지 박스 3/4 - 커리큘럼_03"
                              ></div>
                              
                              {/* 3페이지 - 박스 4/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '3-4' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '53%',
                                  left: '66%',
                                  width: '26%',
                                  height: '12%',
                                }}
                                onClick={() => handlePopupAreaClick(3, '3-4')}
                                onMouseEnter={() => setHoveredPopupArea('3-4')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="3페이지 박스 4/4 - 커리큘럼_07"
                              ></div>
                            </>
                          )}
                          
                          {/* ========== 4페이지 Popup 클릭 영역 (총 8개) ========== */}
                          {page.id === 4 && (
                            <>
                              {/* 4페이지 - 박스 1/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-1' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '10%',
                                  left: '7%',
                                  width: '90%',
                                  height: '9%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-1')}
                                onMouseEnter={() => setHoveredPopupArea('4-1')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 1/8 - 커리큘럼_10"
                              ></div>
                              
                              {/* 4페이지 - 박스 2/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-2' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '29%',
                                  left: '42%',
                                  width: '45%',
                                  height: '5%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-2')}
                                onMouseEnter={() => setHoveredPopupArea('4-2')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 2/8 - 커리큘럼_12"
                              ></div>
                              
                              {/* 4페이지 - 박스 3/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-3' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '35%',
                                  left: '42%',
                                  width: '45%',
                                  height: '5%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-3')}
                                onMouseEnter={() => setHoveredPopupArea('4-3')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 3/8 - 교육방향_03"
                              ></div>
                              
                              {/* 4페이지 - 박스 4/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-4' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '41%',
                                  left: '42%',
                                  width: '45%',
                                  height: '5%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-4')}
                                onMouseEnter={() => setHoveredPopupArea('4-4')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 4/8 - 교육방향_07"
                              ></div>
                              
                              {/* 4페이지 - 박스 5/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-5' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '47%',
                                  left: '42%',
                                  width: '46%',
                                  height: '5%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-5')}
                                onMouseEnter={() => setHoveredPopupArea('4-5')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 5/8 - 교육방향_09"
                              ></div>
                              
                              {/* 4페이지 - 박스 6/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-6' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '53%',
                                  left: '42%',
                                  width: '45%',
                                  height: '5%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-6')}
                                onMouseEnter={() => setHoveredPopupArea('4-6')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 6/8 - 교육방향_11"
                              ></div>
                              
                              {/* 4페이지 - 박스 7/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-7' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '20%',
                                  left: '52%',
                                  width: '37%',
                                  height: '15%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-7')}
                                onMouseEnter={() => setHoveredPopupArea('4-7')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 7/8 - 드림패스-소개_03"
                              ></div>
                              
                              {/* 4페이지 - 박스 8/8 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '4-8' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '3%',
                                  left: '52%',
                                  width: '38%',
                                  height: '15%',
                                }}
                                onClick={() => handlePopupAreaClick(4, '4-8')}
                                onMouseEnter={() => setHoveredPopupArea('4-8')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="4페이지 박스 8/8 - 드림패스-소개_06"
                              ></div>
                            </>
                          )}
                          
                          {/* ========== 5페이지 Popup 클릭 영역 (총 4개) ========== */}
                          {page.id === 5 && (
                            <>
                              {/* 5페이지 - 박스 1/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '5-1' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '10%',
                                  left: '6%',
                                  width: '87%',
                                  height: '9%',
                                }}
                                onClick={() => handlePopupAreaClick(5, '5-1')}
                                onMouseEnter={() => setHoveredPopupArea('5-1')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="5페이지 박스 1/4 - 드림패스-소개_08"
                              ></div>
                              
                              {/* 5페이지 - 박스 2/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '5-2' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '31%',
                                  left: '8%',
                                  width: '87%',
                                  height: '17%',
                                }}
                                onClick={() => handlePopupAreaClick(5, '5-2')}
                                onMouseEnter={() => setHoveredPopupArea('5-2')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="5페이지 박스 2/4 - 드림패스-소개_11"
                              ></div>
                              
                              {/* 5페이지 - 박스 3/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '5-3' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '30%',
                                  left: '8%',
                                  width: '87%',
                                  height: '17%',
                                }}
                                onClick={() => handlePopupAreaClick(5, '5-3')}
                                onMouseEnter={() => setHoveredPopupArea('5-3')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="5페이지 박스 3/4 - 드림패스-소개_13"
                              ></div>
                              
                              {/* 5페이지 - 박스 4/4 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '5-4' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  bottom: '8%',
                                  left: '8%',
                                  width: '87%',
                                  height: '17%',
                                }}
                                onClick={() => handlePopupAreaClick(5, '5-4')}
                                onMouseEnter={() => setHoveredPopupArea('5-4')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="5페이지 박스 4/4 - 드림패스-소개_15"
                              ></div>
                            </>
                          )}
                          
                          {/* ========== 6페이지 Popup 클릭 영역 (총 1개) ========== */}
                          {page.id === 6 && (
                            <>
                              {/* 6페이지 - 박스 1/1 */}
                              <div 
                                className={`absolute cursor-pointer rounded-lg ${
                                  isPopupModalOpen ? 'pointer-events-none' : ''
                                } ${
                                  hoveredPopupArea === '6-1' ? 'border-2 border-yellow-500' : ''
                                }`}
                                style={{
                                  position: 'absolute',
                                  top: '90%',
                                  left: '50%',
                                  width: '93%',
                                  height: '19%',
                                  transform: 'translate(-50%, -50%)',
                                }}
                                onClick={() => handlePopupAreaClick(6, '6-1')}
                                onMouseEnter={() => setHoveredPopupArea('6-1')}
                                onMouseLeave={() => setHoveredPopupArea(null)}
                                title="6페이지 박스 1/1 - 마지막장_03"
                              ></div>
                            </>
                          )}
                          
                          {/* 왼쪽 터치 영역 */}
                          <div 
                            className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                            onMouseDown={() => handleTouchAreaMouseDown('left')}
                            onMouseUp={handleTouchAreaMouseUp}
                            onTouchStart={() => handleTouchAreaTouchStart('left')}
                            onTouchEnd={handleTouchAreaTouchEnd}
                            title="이전 페이지로 이동"
                          />
                          
                          {/* 오른쪽 터치 영역 */}
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
                    ))}
                  </HTMLFlipBook>
                </div>
              </div>
              
              {/* 오른쪽 네비게이션 버튼들 */}
              <div className="flex flex-col items-center gap-2">
                {/* Right 버튼 */}
                <button
                  onClick={goToNextPage}
                  className={`transition-transform duration-200 ${
                    isLastPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  }`}
                  style={{ width: '48px', height: '48px', padding: '8px' }}
                  title={isLastPage ? '마지막 페이지입니다' : '다음 페이지'}
                  disabled={isLastPage}
                >
                  <img
                    src="/FrienderFile/Interactive/arrow_right.svg"
                    alt="다음 페이지"
                    style={{ width: '32px', height: '32px' }}
                  />
                </button>
                {/* Last 버튼 */}
                <button
                  onClick={goToLastPage}
                  className={`transition-transform duration-200 ${
                    isLastPage ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  }`}
                  style={{ width: '48px', height: '48px', padding: '8px' }}
                  title={isLastPage ? '이미 마지막 페이지입니다' : '마지막 페이지'}
                  disabled={isLastPage}
                >
                  <img
                    src="/FrienderFile/Interactive/arrow_last.svg"
                    alt="마지막 페이지"
                    style={{ width: '32px', height: '32px' }}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* 하단 툴바 - 모든 화면 크기에서 표시 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 p-3">
            <div className="flex justify-center items-center gap-4">
              {/* 홈 버튼 */}
              <button
                onClick={handleHomeClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="홈"
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
                title="프린트"
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
                title="PDF 다운로드"
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
              
              {/* 목차 버튼 */}
              <button
                onClick={handleTocClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="목차"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              
              {/* 공유 버튼 */}
              <button
                onClick={handleShareClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="공유"
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
            </div>
          </div>
        </div>
      )}
      
      {/* Popup 모달 */}
      {isPopupModalOpen && selectedPopupArea && selectedPopupPage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePopupModal}
          onMouseMove={isModalDragging ? handleModalDragMove : undefined}
          onMouseUp={isModalDragging ? handleModalDragEnd : undefined}
          onMouseLeave={isModalDragging ? handleModalDragEnd : undefined}
        >
          {/* 고정 버튼들 - 모달 외부에 배치 */}
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePopupModal();
              }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm text-red-600 flex items-center justify-center hover:text-red-700 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-colors duration-300 cursor-pointer"
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

          {/* 모달 내용 */}
          <div
            className={`relative max-w-[90vw] max-h-[90vh] ${isModalZoomed ? 'cursor-grab' : ''} ${
              isModalDragging ? 'cursor-grabbing' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={isModalZoomed ? handleModalDragStart : undefined}
            style={{
              transform: `scale(${modalZoomLevel}) translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isModalDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
          >
            <div className="bg-white rounded-lg p-4 shadow-2xl">
              <img
                src={getPopupImagePath(selectedPopupArea)}
                alt={`${selectedPopupPage}페이지 ${selectedPopupArea} 팝업`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  const errorDiv = e.target.nextSibling;
                  if (errorDiv) {
                    errorDiv.style.display = 'block';
                  }
                }}
              />
              <div className="hidden text-gray-500 text-center mt-4" style={{ display: 'none' }}>
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: {getPopupImagePath(selectedPopupArea)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DreamPathPage;
