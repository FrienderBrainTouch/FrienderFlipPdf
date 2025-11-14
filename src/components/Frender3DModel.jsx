import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// Draco 압축 모델 지원: CDN에서 자동 로드
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

// 전역 로딩 매니저 디버그 훅
THREE.DefaultLoadingManager.onStart = (url, loaded, total) => {
  // eslint-disable-next-line no-console
  console.log('[Loader] Start:', { url, loaded, total });
};
THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
  // eslint-disable-next-line no-console
  console.log('[Loader] Progress:', { url, loaded, total });
};
THREE.DefaultLoadingManager.onLoad = () => {
  // eslint-disable-next-line no-console
  console.log('[Loader] All resources loaded');
};
THREE.DefaultLoadingManager.onError = (url) => {
  // eslint-disable-next-line no-console
  console.error('[Loader] Error:', { url });
};


/**
 * 하이라이트 기능이 있는 투명 박스 컴포넌트
 * 클릭 영역을 제공하고 하이라이트 효과를 표시합니다.
 */
function HighlightBox({ position, size, color = 0x00ff00, opacity = 0, onHover, onClick, isActive = false }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 박스 투명도 설정: 활성화/호버 시만 보이게, 비활성 상태는 투명도 0
  const baseOpacity = opacity; // prop으로 전달된 기본 투명도
  const currentOpacity = isHovered || isActive 
    ? Math.min(baseOpacity + 0.2, 1.0) // 호버/활성화 시 더 밝게 (최대 1.0)
    : 0; // 비활성 상태는 완전 투명
  const highlightColor = color;
  
  return (
    <mesh 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover && onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        onHover && onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial 
        color={highlightColor}
        transparent={true} 
        opacity={currentOpacity}
        side={2} // DoubleSide로 설정하여 양면 모두 렌더링
      />
    </mesh>
  );
}

/**
 * 4개의 파트 박스를 배치하는 컴포넌트
 */
function PartBoxes({ modelPath, customScale = null, onPartClick, boxOpacity = 0.2 }) {
  const { scene } = useGLTF(modelPath);
  const [modelData, setModelData] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [activeBox, setActiveBox] = useState(0); // 현재 활성화된 박스 인덱스
  const [isModelReady, setIsModelReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false); // 애니메이션 일시정지 상태
  const [selectedBox, setSelectedBox] = useState(null); // 사용자가 선택한 박스

  // 모바일 감지
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 커서 제어를 위한 useEffect
  React.useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      if (hoveredBox !== null) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [hoveredBox]);

  React.useEffect(() => {
    if (scene) {
      // 모델이 완전히 로딩되었는지 확인
      const checkModelReady = () => {
        if (scene.children && scene.children.length > 0) {
          // 모델의 바운딩 박스 계산
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // 모델 크기가 유효한지 확인 (0이 아닌 값들)
          if (size.x > 0 && size.y > 0 && size.z > 0) {
            console.log('PartBoxes - Model size:', size);
            console.log('PartBoxes - Model center:', center);
            
            // 모델 데이터 설정
            setModelData({
              size: [size.x, size.y, size.z],
              center: [center.x, center.y, center.z]
            });
            setIsModelReady(true);
          } else {
            // 모델이 아직 완전히 로딩되지 않았으면 잠시 후 다시 시도
            setTimeout(checkModelReady, 100);
          }
        } else {
          // 모델이 아직 로딩되지 않았으면 잠시 후 다시 시도
          setTimeout(checkModelReady, 100);
        }
      };
      
      checkModelReady();
    }
  }, [scene]);

  // 박스 활성화 애니메이션: 1번부터 차례대로 하나씩만 활성화
  React.useEffect(() => {
    if (!modelData || isAnimationPaused) return;

    // 처음에는 0번(1번 박스)부터 시작
    setActiveBox(0);
    
    const interval = setInterval(() => {
      setActiveBox(prev => (prev + 1) % 4); // 0, 1, 2, 3 순환 (한 번에 하나만 활성화)
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, [modelData, isAnimationPaused]);

  if (!modelData || !isModelReady) return null;

  // 모바일/데스크톱에 따른 박스 크기 정의
  const boxSizes = isMobile ? [
    // 모바일 버전 - 박스 크기 조정
    // 1번 박스 (파이버시멘트보드)
    [modelData.size[0] * 0.4, modelData.size[1] * 1.2, modelData.size[2] * 2],
    // 2번 박스 (AL 복합판넬)
    [modelData.size[0] * 0.2, modelData.size[1] * 1.2, modelData.size[2] * 2],
    // 3번 박스 (AL 시트판넬)
    [modelData.size[0] * 0.2, modelData.size[1] * 1.2, modelData.size[2] * 2],
    // 4번 박스 (조적판넬)
    [modelData.size[0] * 0.2, modelData.size[1] * 1.2, modelData.size[2] * 2]
  ] : [
    // 데스크톱 버전 - 기존 크기
    // 1번 박스 (파이버시멘트보드) - 다른 크기
    [modelData.size[0] * 1.2, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 2번 박스 (AL 복합판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 3번 박스 (AL 시트판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 4번 박스 (조적판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0]
  ];

  // 모바일/데스크톱에 따른 박스 위치 정의
  const boxPositions = isMobile ? [
    // 모바일 버전 - 박스 위치 조정
    [-modelData.size[0] * 0.4, modelData.size[1] * 0.01, modelData.size[2] * 0.15], // 1번 패널 (왼쪽) - 파이버시멘트보드
    [modelData.size[0] * 0.1, modelData.size[1] * 0.02, modelData.size[2] * 0.15], // 3번 패널 (중앙) - AL 복합판넬
    [modelData.size[0] * 0.1 + modelData.size[0] * 0.2, modelData.size[1] * 0.02, modelData.size[2] * 0.15], // 4번 패널 (오른쪽) - AL 시트판넬
    [modelData.size[0] * 0.1 + modelData.size[0] * 0.42, modelData.size[1] * 0.02, modelData.size[2] * 0.15] // 5번 패널 (가장 오른쪽) - 조적판넬
  ] : [
    // 데스크톱 버전 - 기존 위치
    // 이미지 분석: 1번(왼쪽), 3번(중앙), 4번(오른쪽), 5번(가장 오른쪽) 패널에 배치
    [-modelData.size[0] * 1.1, modelData.size[1] * 0.1, modelData.size[2] * 0.1], // 1번 패널 (왼쪽) - 파이버시멘트보드
    [modelData.size[0] * 0.3, modelData.size[1] * 0.15, modelData.size[2] * 0.1], // 3번 패널 (중앙) - AL 복합판넬
    [modelData.size[0] * 0.3 + modelData.size[0] * 0.55, modelData.size[1] * 0.15, modelData.size[2] * 0.1], // 4번 패널 (오른쪽) - AL 시트판넬
    [modelData.size[0] * 0.3 + modelData.size[0] * 1.1, modelData.size[1] * 0.15, modelData.size[2] * 0.1] // 5번 패널 (가장 오른쪽) - 조적판넬
  ];

  const boxColors = [0xff0000, 0x00ff00,0xffa500 , 0x0000ff]; // 빨강, 녹색,밝은 주황색 , 파랑

  // 호버 시 애니메이션 멈추기
  const handleBoxHover = (isHovered, index) => {
    setHoveredBox(isHovered ? index : null);
    if (isHovered) {
      setIsAnimationPaused(true);
      setActiveBox(index); // 호버한 박스 활성화
    } else if (selectedBox === null) {
      // 선택된 박스가 없을 때만 애니메이션 재개
      setIsAnimationPaused(false);
    }
  };

  // 클릭 시 애니메이션 멈추고 선택된 박스 활성화
  const handleBoxClick = (index) => {
    console.log(`Part ${index + 1} clicked`);
    setIsAnimationPaused(true);
    setSelectedBox(index);
    setActiveBox(index);
    onPartClick && onPartClick(index + 1);
  };

  // 실제 활성화 상태: 선택된 박스가 있으면 선택된 박스만, 없으면 애니메이션 활성화 박스
  const getIsActive = (index) => {
    if (selectedBox !== null) {
      return selectedBox === index;
    }
    return activeBox === index;
  };

  return (
    <group scale={customScale || 1}>
      {boxPositions.map((position, index) => (
        <HighlightBox
          key={index}
          position={position}
          size={boxSizes[index]}
          color={boxColors[index]}
          opacity={boxOpacity} // prop으로 전달된 투명도 (0으로 설정하면 안 보임)
          isActive={getIsActive(index)} // 현재 활성화된 박스
          onHover={(isHovered) => handleBoxHover(isHovered, index)}
          onClick={() => handleBoxClick(index)}
        />
      ))}
    </group>
  );
}

/**
 * 3D 모델 컴포넌트
 * GLB 파일을 로드하고 회전 애니메이션을 적용합니다.
 */
function FrenderModel({ modelPath, customScale = null, showWireframe = false, onPartClick = null, onModelLoad = null, boxOpacity = 0.2 }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isModelFullyLoaded, setIsModelFullyLoaded] = useState(false);
  const [actualModelLoaded, setActualModelLoaded] = useState(false);

  // 자동 회전 애니메이션 비활성화
  // useFrame((state, delta) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += delta * 0.5;
  //   }
  // });

  // 모델 경로가 변경될 때 상태 초기화
  React.useEffect(() => {
    setIsInitialized(false);
    setIsModelFullyLoaded(false);
    setActualModelLoaded(false);
  }, [modelPath]);

  // 모델이 실제로 사용 가능한지 검증하는 함수
  const validateModel = (scene) => {
    if (!scene || !scene.children || scene.children.length === 0) {
      return false;
    }
    
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    
    // 크기가 너무 작거나 0인 경우 무효
    if (size.x < 0.001 || size.y < 0.001 || size.z < 0.001) {
      return false;
    }
    
    // 메시가 실제로 있는지 확인
    let hasValidMesh = false;
    scene.traverse((child) => {
      if (child.isMesh && child.geometry && child.material) {
        hasValidMesh = true;
      }
    });
    
    return hasValidMesh;
  };

  // 3D 모델의 중심을 계산하여 위치 조정 (한 번만 실행)
  React.useEffect(() => {
    if (scene && meshRef.current && !isInitialized) {
      // 모델이 실제로 렌더링 가능한 상태인지 확인
      const checkModelReady = () => {
        if (validateModel(scene)) {
          // 바운딩 박스 계산
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          
          // 중심을 원점으로 이동
          scene.position.set(-center.x, -center.y, -center.z);
          
          // 스케일 조정 (커스텀 스케일이 있으면 사용, 없으면 자동 계산)
          if (customScale !== null) {
            scene.scale.setScalar(customScale);
          } else {
            const size = box.getSize(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxSize; // 적절한 크기로 조정
            scene.scale.setScalar(scale);
          }
          
          setActualModelLoaded(true);
          setIsInitialized(true);
          setIsModelFullyLoaded(true);
          
          // 모델 로딩 완료 콜백 호출
          if (onModelLoad) {
            onModelLoad();
          }
          
          console.log('[3D] 모델 로딩 완료:', getModelDisplayName(modelPath));
        } else {
          // 모델이 아직 완전히 로딩되지 않았으면 재시도
          setTimeout(checkModelReady, 100);
        }
      };
      
      checkModelReady();
    }
  }, [scene, customScale, isInitialized, onModelLoad, modelPath]);

  return (
    <group>
      <primitive
        ref={meshRef}
        object={scene}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {/* 파트 선택 박스 - 투명하게 표시 */}
      {showWireframe && isModelFullyLoaded && (
        <PartBoxes 
          modelPath={modelPath} 
          customScale={customScale} 
          onPartClick={onPartClick}
          boxOpacity={boxOpacity}
        />
      )}
    </group>
  );
}

/**
 * 평행사변형 3D 모델 뷰어 컴포넌트
 * 표지 페이지에 absolute로 배치되어 3D 모델을 표시합니다.
 */
// 모델 파일명을 한국어 이름으로 매핑하는 함수
const getModelDisplayName = (modelPath) => {
  const fileName = modelPath.split('/').pop().replace('.glb', '');
  
  const modelNames = {
    '1_System_Fiber_SET': '파이버시멘트보드',
    '2_System_Alu-Complex_SET': 'AL 복합판넬',
    '3_System_Alu-Sheet_SET': 'AL 시트판넬',
    '4_System_Three_SET': '조적판넬',
    'system_with_panel': '시스템 with 패널',
    'system_without_panel': '시스템 without 패널',
    'L-AnkerBracket': 'L-앙카프라켓',
    'L-Bar': '수직 L-Bar',
    'L-HBar': '수평바',
    'L-Holder': '수평바 브라켓',
    'BlackFacing': '검은색 마감재'
  };
  
  return modelNames[fileName] || fileName;
};

function Frender3DModel({ 
  isVisible = true, 
  opacity = 1, 
  scale = 1, 
  position = { x: 0, y: 0 },
  animationDelay = 0,
  modelPath = "/IsoverFile/3dmodel/Untitled.glb",
  isModal = false,
  cameraPosition = [0, 0, 8],
  cameraFov = 35,
  customScale = null,
  rotateSpeed = 1.0,
  showWireframe = false,
  onPartClick = null,
  onModelLoad = null,
  boxOpacity = 0.2
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [animationOpacity, setAnimationOpacity] = useState(0);
  const [animationScale, setAnimationScale] = useState(0.8);
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const [actualModelLoaded, setActualModelLoaded] = useState(false);

  // 로더 진행률 (drei)
  const { active, progress, errors, item, loaded, total } = useProgress();

  React.useEffect(() => {
    // 에러가 발생한 경우만 로그 출력
    if (errors.length > 0) {
      console.error('[3D] 모델 로딩 에러:', errors);
      handleError();
    }
  }, [errors]);

  // 타임아웃을 통한 무한 로딩 방지
  React.useEffect(() => {
    if (isLoading && !actualModelLoaded) {
      const timeout = setTimeout(() => {
        if (!actualModelLoaded) {
          console.warn('[3D] 모델 로딩 타임아웃:', getModelDisplayName(modelPath));
          setActualModelLoaded(true);
          setIsLoading(false);
        }
      }, 400000); // 타임아웃 시간을 300초로 증가
      
      setLoadingTimeout(timeout);
      
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [isLoading, actualModelLoaded]);

  // 로딩 완료 핸들러
  const handleLoad = () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    setActualModelLoaded(true);
    setIsLoading(false);
    onModelLoad && onModelLoad(); // 모델 로딩 완료 콜백 호출
  };

  // 에러 핸들러
  const handleError = () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    setHasError(true);
    setIsLoading(false);
  };

  // 모델 경로가 변경될 때 상태 초기화
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setActualModelLoaded(false);
  }, [modelPath]);

  // 애니메이션 효과
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationOpacity(opacity);
        setAnimationScale(scale);
        setAnimationPosition(position);
      }, animationDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, opacity, scale, position, animationDelay]);

  // 컴포넌트 언마운트 시 타임아웃 정리
  React.useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  if (!isVisible) return null;

  return (
    <div 
      className={`absolute z-10 ${isModal ? 'w-full h-full top-0 left-0' : ' '}`}
      style={{
        width: isModal ? '100%' : '100%',
        height: isModal ? '100%' : '100%',
        top: isModal ? '0%' : '0%',
        left: isModal ? '0%' : '0%'
      }}
      data-clickable="true"
    >
      {/* 3D 모델 컨테이너 */}
      <div 
        className="relative w-full h-full"
        style={{
          clipPath: 'none',
          // transform: 'perspective(1000px) rotateX(0deg) rotateY(-20deg) rotateZ(2deg)',
          // transformStyle: 'preserve-3d',
          // transformOrigin: 'center center'
        }}
      >
        {/* 3D 모델 캔버스 - clip-path 영역 내에서 중앙 배치 */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            left: '0%',
            width: '100%',
            top: '0%',
            height: '100%'
          }}
        >
          
          {hasError && (
            <div className="w-full h-full bg-red-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-2 font-medium">3D 모델 로딩 실패</p>
                <p className="text-red-500 text-sm mb-4">모델: {getModelDisplayName(modelPath)}</p>
                <button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    setActualModelLoaded(false);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {isLoading && !actualModelLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-2 font-medium">3D 모델 로딩 중...</p>
                
                {/* useProgress 정보 표시 */}
                <div className="text-sm text-gray-500 mb-2">
                  {active ? `로딩 중... ${Math.round(progress)}%` : '처리 중...'}
                </div>
                
                {/* 타임아웃 경고 */}
                {progress > 0 && progress < 100 && (
                  <div className="text-xs text-orange-500">
                    로딩이 오래 걸리고 있습니다...
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  모델: {getModelDisplayName(modelPath)}
                </div>
              </div>
            </div>
          )}

          {!hasError && (
            <Canvas
              camera={{ position: cameraPosition, fov: cameraFov }}
              onError={(e) => {
                console.error('[3D] Canvas 에러:', e);
                handleError();
              }}
              style={{ 
                width: '100%', 
                height: '100%',
                cursor: 'default'
              }}
            >
              <Suspense fallback={null}>
                {/* 조명 설정 - HDRI 대신 기본 조명 사용 */}
                <ambientLight intensity={3} />
                <directionalLight position={[-3, 0, 6]} intensity={2} />
                <pointLight position={[-3, 0, 6]} intensity={1.6} />

                
                
                {/* 3D 모델 */}
                <FrenderModel 
                  modelPath={modelPath} 
                  customScale={customScale} 
                  showWireframe={showWireframe} 
                  onPartClick={onPartClick} 
                  onModelLoad={handleLoad}
                  boxOpacity={boxOpacity} 
                />
                
                {/* 환경 설정 - HDRI 로딩 오류 방지를 위해 제거 */}
                {/* <Environment preset="studio" /> */}
                
                {/* 오빗 컨트롤 - 모델링 중심(0,0,0) 기준 회전 */}
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={false}
                  maxPolarAngle={Math.PI}
                  minPolarAngle={0}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                  minDistance={4}
                  maxDistance={20}
                  rotateSpeed={rotateSpeed}
                />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}

export default Frender3DModel;
