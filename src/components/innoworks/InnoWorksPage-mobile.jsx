import React from 'react';

function InnoWorksPageMobile({ language = 'ko' }) {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // InnoWorks 페이지 데이터 (6페이지)
  const pageImages = React.useMemo(() => [
    {
      id: 0,
      name: "표지",
      backgroundImage: `/InnoWorks/Page/${language}/1.svg`,
    },
    {
      id: 1,
      name: "페이지 1",
      backgroundImage: `/InnoWorks/Page/${language}/2.svg`,
    },
    {
      id: 2,
      name: "페이지 2",
      backgroundImage: `/InnoWorks/Page/${language}/3.svg`,
    },
    {
      id: 3,
      name: "페이지 3",
      backgroundImage: `/InnoWorks/Page/${language}/4.svg`,
    },
    {
      id: 4,
      name: "페이지 4",
      backgroundImage: `/InnoWorks/Page/${language}/5.svg`,
    },
    {
      id: 5,
      name: "페이지 5",
      backgroundImage: `/InnoWorks/Page/${language}/6.svg`,
    },
  ], [language]);
  
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

export default InnoWorksPageMobile;