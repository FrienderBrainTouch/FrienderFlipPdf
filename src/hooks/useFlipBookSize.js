import { useState, useEffect, useCallback } from 'react';

const ORIGINAL_ASPECT_RATIO = 2382 / 3369;

/**
 * 플립북 크기를 화면 크기에 맞게 계산하는 훅
 * @param {Object} options - 옵션 설정
 * @param {number} options.minWidth - 최소 너비 (기본값: 400)
 * @param {number} options.maxWidth - 최대 너비 (기본값: 800)
 * @param {number} options.widthRatio - 화면 너비 대비 비율 (기본값: 0.4)
 * @param {number} options.maxHeightRatio - 화면 높이 대비 최대 비율 (기본값: 0.8)
 * @param {number} options.aspectRatio - 이미지 가로세로 비율 (기본값: ORIGINAL_ASPECT_RATIO)
 * @returns {{width: number, height: number}} 계산된 플립북 크기
 */
export function useFlipBookSize(options = {}) {
  const {
    minWidth = 400,
    maxWidth = 800,
    widthRatio = 0.4,
    maxHeightRatio = 0.8,
    aspectRatio = ORIGINAL_ASPECT_RATIO,
  } = options;

  const calculateSize = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const targetWidth = Math.max(minWidth, Math.min(maxWidth, screenWidth * widthRatio));
    const targetHeight = targetWidth / aspectRatio;

    const maxHeight = screenHeight * maxHeightRatio;
    if (targetHeight > maxHeight) {
      const adjustedWidth = maxHeight * aspectRatio;
      return {
        width: Math.max(350, adjustedWidth),
        height: maxHeight,
      };
    }

    return {
      width: targetWidth,
      height: targetHeight,
    };
  }, [minWidth, maxWidth, widthRatio, maxHeightRatio, aspectRatio]);

  const [flipBookSize, setFlipBookSize] = useState(calculateSize);

  useEffect(() => {
    const handleResize = () => {
      setFlipBookSize(calculateSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSize]);

  return flipBookSize;
}
