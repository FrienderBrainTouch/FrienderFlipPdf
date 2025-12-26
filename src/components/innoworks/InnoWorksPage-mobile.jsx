import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LANGUAGE_FOLDER_MAP } from '../../utils/language';
import downloadPdf from '../../utils/downloadPdf';
import { getInnoworksPdfPath } from '../../utils/pdfPaths';

/**
 * InnoWorksPage-mobile 컴포넌트
 *
 * 이 컴포넌트는 모바일용 InnoWorks 페이지를 구현합니다.
 * 주요 기능:
 * - 초기 로딩 애니메이션 (Friender 로고)
 * - 흰 화면에서 본 화면으로의 전환 효과
 * - 스크롤 방식 페이지 네비게이션
 * - 네비게이션 및 툴바 기능
 */
function InnoWorksPageMobile({ language = 'ko' }) {
  // 상태 관리 변수들
  const [showIntro, setShowIntro] = useState(true); // 인트로 화면 표시 여부
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도
  const [whiteScreenVisible, setWhiteScreenVisible] = useState(true); // 흰 화면 표시 여부
  const [mainScreenVisible, setMainScreenVisible] = useState(false); // 본 화면 표시 여부

  // Popup 모달 상태 관리
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [selectedPopupArea, setSelectedPopupArea] = useState(null);
  const [selectedPopupPage, setSelectedPopupPage] = useState(null);

  // 모달창 확대/축소 상태 관리
  const [modalZoomLevel, setModalZoomLevel] = useState(1);
  const [isModalZoomed, setIsModalZoomed] = useState(false);

  // 모달창 드래그 상태
  const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = useState(false);
  const modalDragStartRef = useRef({ x: 0, y: 0 });

  // ref 변수들
  const animationRef = useRef(null);

  // 경로 생성: 한국어는 루트, 다국어는 Multilingual 하위
  const pageImages = useMemo(() => {
    const getPagePath = (pageNum) => {
      if (language === 'ko') {
        return `/Innoworks/Page/${pageNum}.svg`;
      }
      // 언어 코드를 폴더명으로 변환 (ja -> Japan, zh -> China 등)
      const folderName = LANGUAGE_FOLDER_MAP[language] || language;
      return `/Innoworks/Multilingual/${folderName}/Page/${pageNum}.svg`;
    };

    return [
      {
        id: 0,
        name: '표지',
        backgroundImage: getPagePath(1),
      },
      {
        id: 1,
        name: '페이지 1',
        backgroundImage: getPagePath(2),
      },
      {
        id: 2,
        name: '페이지 2',
        backgroundImage: getPagePath(3),
      },
      {
        id: 3,
        name: '페이지 3',
        backgroundImage: getPagePath(4),
      },
      {
        id: 4,
        name: '페이지 4',
        backgroundImage: getPagePath(5),
      },
      {
        id: 5,
        name: '페이지 5',
        backgroundImage: getPagePath(6),
      },
    ];
  }, [language]);

  // 로고 애니메이션 완료 후 화면 전환
  useEffect(() => {
    if (logoOpacity === 1) {
      setTimeout(() => {
        setWhiteScreenVisible(false);
        setTimeout(() => {
          setMainScreenVisible(true);
        }, 500);
      }, 500);
    }
  }, [logoOpacity]);

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
   * 홈 버튼 클릭 핸들러 - 인트로 화면 재시작
   */
  const handleHomeClick = () => {
    // 상태 초기화
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
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      logoAnimation();
    }, 100);
  };

  /**
   * 프린터 버튼 클릭 핸들러
   */
  const handlePrintClick = () => {
    // InnoWorks PDF가 있다면 사용, 없으면 현재 페이지 인쇄
    const pdfUrl = `/Innoworks/Innoworks-Pdf/${
      language === 'ko' ? '한국어.pdf' : `innoworks-${language}.pdf`
    }`;
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
    const pdfUrl = getInnoworksPdfPath(language);
    const suggestedName = language === 'ko' ? 'innoworks-ko.pdf' : `innoworks-${language}.pdf`;
    downloadPdf(pdfUrl, suggestedName).catch(() => {});
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'InnoWorks',
          text: 'InnoWorks에 대해 확인해보세요!',
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
    // 스크롤을 2번째 페이지로 이동
    const secondPage = document.querySelector('[data-page-index="1"]');
    if (secondPage) {
      secondPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Popup 영역 클릭 핸들러
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
      if (newLevel <= 1) {
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
    if (isModalZoomed) {
      setIsModalDragging(true);
      modalDragStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  /**
   * 모달 드래그 이동 핸들러
   */
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

  /**
   * 모달 드래그 종료 핸들러
   */
  const handleModalDragEnd = () => {
    setIsModalDragging(false);
  };

  /**
   * Popup 이미지 경로 생성 함수
   */
  const getPopupImagePath = (areaId) => {
    if (language === 'ko') {
      return `/Innoworks/Popup/${areaId}.png`;
    }
    const folderName = LANGUAGE_FOLDER_MAP[language] || language;
    return `/Innoworks/Multilingual/${folderName}/Popup/${areaId}.png`;
  };

  /**
   * 비디오인지 확인하는 함수
   * @param {string} areaId - 영역 ID
   * @returns {boolean} 비디오 여부
   */
  const isVideoPopup = (areaId) => {
    return areaId === '4-5' || areaId === '4-6';
  };

  /**
   * 비디오 경로 반환 함수
   * @param {string} areaId - 영역 ID
   * @returns {string} 비디오 경로
   */
  const getVideoPath = (areaId) => {
    return '/video/Innoworks.mp4';
  };

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
          {/* 스크롤 컨테이너 */}
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

                    {/* Popup 클릭 영역들 */}
                    {/* 1페이지 (표지) - id: 0 */}
                    {page.id === 0 && (
                      <>
                        {/* 1페이지 - 박스 1/2 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '37%',
                            left: '7%',
                            width: '52%',
                            height: '7%',
                          }}
                          onClick={() => handlePopupAreaClick(1, '1-1')}
                          title="1페이지 박스 1/2"
                        ></div>

                        {/* 1페이지 - 박스 2/2 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '44%',
                            left: '7%',
                            width: '46%',
                            height: '17%',
                          }}
                          onClick={() => handlePopupAreaClick(1, '1-2')}
                          title="1페이지 박스 2/2"
                        ></div>
                      </>
                    )}

                    {/* 2페이지 - id: 1 */}
                    {page.id === 1 && (
                      <>
                        {/* 2페이지 - 박스 1/5 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '37%',
                            left: '12%',
                            width: '74%',
                            height: '14%',
                          }}
                          onClick={() => handlePopupAreaClick(2, '2-1')}
                          title="2페이지 박스 1/5"
                        ></div>

                        {/* 2페이지 - 박스 2/5 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '67%',
                            left: '16%',
                            width: '21%',
                            height: '7%',
                          }}
                          onClick={() => handlePopupAreaClick(2, '2-2')}
                          title="2페이지 박스 2/5"
                        ></div>

                        {/* 2페이지 - 박스 3/5 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '67%',
                            left: '40%',
                            width: '20%',
                            height: '7%',
                          }}
                          onClick={() => handlePopupAreaClick(2, '2-3')}
                          title="2페이지 박스 3/5"
                        ></div>

                        {/* 2페이지 - 박스 4/5 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '67%',
                            left: '64%',
                            width: '20%',
                            height: '7%',
                          }}
                          onClick={() => handlePopupAreaClick(2, '2-4')}
                          title="2페이지 박스 4/5"
                        ></div>

                        {/* 2페이지 - 박스 5/5 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '81%',
                            left: '14%',
                            width: '24%',
                            height: '6%',
                          }}
                          onClick={() => handlePopupAreaClick(2, '2-5')}
                          title="2페이지 박스 5/5"
                        ></div>
                      </>
                    )}

                    {/* 3페이지 - id: 2 */}
                    {page.id === 2 && (
                      <>
                        {/* 3페이지 - 박스 1/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '49%',
                            left: '27%',
                            width: '20.66%',
                            height: '14.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-1')}
                          title="3페이지 박스 1/6"
                        ></div>

                        {/* 3페이지 - 박스 2/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '49%',
                            left: '49.66%',
                            width: '21.66%',
                            height: '13.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-2')}
                          title="3페이지 박스 2/6"
                        ></div>

                        {/* 3페이지 - 박스 3/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '49%',
                            left: '72.32%',
                            width: '22.66%',
                            height: '13.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-3')}
                          title="3페이지 박스 3/6"
                        ></div>

                        {/* 3페이지 - 박스 4/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '66%',
                            left: '26.98%',
                            width: '23.66%',
                            height: '11.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-4')}
                          title="3페이지 박스 4/6"
                        ></div>

                        {/* 3페이지 - 박스 5/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '86%',
                            left: '5.64%',
                            width: '45.66%',
                            height: '10.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-5')}
                          title="3페이지 박스 5/6"
                        ></div>

                        {/* 3페이지 - 박스 6/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '86%',
                            left: '52.3%',
                            width: '42.66%',
                            height: '10.66%',
                          }}
                          onClick={() => handlePopupAreaClick(3, '3-6')}
                          title="3페이지 박스 6/6"
                        ></div>
                      </>
                    )}

                    {/* 4페이지 - id: 3 */}
                    {page.id === 3 && (
                      <>
                        {/* 4페이지 - 박스 1/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '54%',
                            left: '11%',
                            width: '36%',
                            height: '8%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-1')}
                          title="4페이지 박스 1/6"
                        ></div>

                        {/* 4페이지 - 박스 2/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '54%',
                            left: '53%',
                            width: '36%',
                            height: '8%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-2')}
                          title="4페이지 박스 2/6"
                        ></div>

                        {/* 4페이지 - 박스 3/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '85%',
                            left: '11%',
                            width: '36%',
                            height: '8%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-3')}
                          title="4페이지 박스 3/6"
                        ></div>

                        {/* 4페이지 - 박스 4/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '85%',
                            left: '53%',
                            width: '36%',
                            height: '8%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-4')}
                          title="4페이지 박스 4/6"
                        ></div>

                        {/* 4페이지 - 박스 5/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '66%',
                            left: '10%',
                            width: '37%',
                            height: '14%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-5')}
                          title="4페이지 박스 5/6"
                        ></div>

                        {/* 4페이지 - 박스 6/6 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '82%',
                            left: '9%',
                            width: '39%',
                            height: '15%',
                          }}
                          onClick={() => handlePopupAreaClick(4, '4-6')}
                          title="4페이지 박스 6/6"
                        ></div>
                      </>
                    )}

                    {/* 5페이지 - id: 4 */}
                    {page.id === 4 && (
                      <>
                        {/* 5페이지 - 박스 1/1 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '85%',
                            left: '68%',
                            width: '35%',
                            height: '18%',
                            transform: 'translate(-50%, -50%)',
                          }}
                          onClick={() => handlePopupAreaClick(5, '5-1')}
                          title="5페이지 박스 1/1"
                        ></div>
                      </>
                    )}

                    {/* 6페이지 - id: 5 */}
                    {page.id === 5 && (
                      <>
                        {/* 6페이지 - 박스 1/1 */}
                        <div
                          className={`absolute cursor-pointer rounded-lg ${
                            isPopupModalOpen ? 'pointer-events-none' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            top: '88%',
                            left: '76%',
                            width: '40%',
                            height: '20%',
                            transform: 'translate(-50%, -50%)',
                          }}
                          onClick={() => handlePopupAreaClick(6, '6-1')}
                          title="6페이지 박스 1/1"
                        ></div>
                      </>
                    )}
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
              {isVideoPopup(selectedPopupArea) ? (
                <video
                  src={getVideoPath(selectedPopupArea)}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls
                />
              ) : (
                <>
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
                  <div
                    className="hidden text-gray-500 text-center mt-4"
                    style={{ display: 'none' }}
                  >
                    <p>이미지를 불러올 수 없습니다.</p>
                    <p className="text-sm">경로: {getPopupImagePath(selectedPopupArea)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InnoWorksPageMobile;
