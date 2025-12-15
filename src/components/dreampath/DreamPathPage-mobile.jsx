import React from 'react';

function DreamPathPageMobile({ language = 'ko' }) {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // 경로 생성: 한국어는 루트, 다국어는 Multilingual 하위
  const pageImages = React.useMemo(() => {
    const getPagePath = (pageNum) => {
      if (language === 'ko') {
        return `/DreamPath/Page/${pageNum}.svg`;
      }
      return `/DreamPath/Multilingual/${language}/Page/${pageNum}.svg`;
    };
    
    return [
      {
        id: 0,
        name: "표지",
        backgroundImage: getPagePath(1),
      },
      {
        id: 1,
        name: "페이지 1",
        backgroundImage: getPagePath(2),
      },
      {
        id: 2,
        name: "페이지 2",
        backgroundImage: getPagePath(3),
      },
      {
        id: 3,
        name: "페이지 3",
        backgroundImage: getPagePath(4),
      },
      {
        id: 4,
        name: "페이지 4",
        backgroundImage: getPagePath(5),
      },
      {
        id: 5,
        name: "페이지 5",
        backgroundImage: getPagePath(6),
      },
    ];
  }, [language]);
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < pageImages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 relative">
      {/* 페이지 표시 */}
      <div className="w-full h-full">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${pageImages[currentPage].backgroundImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      {/* 네비게이션 버튼 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-2 bg-white rounded">
          {currentPage + 1} / {pageImages.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === pageImages.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default DreamPathPageMobile;