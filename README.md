# FrienderFlipPdf

Friender 회사의 인터랙티브 전자 카탈로그 웹 애플리케이션입니다. 플립북 스타일의 페이지 전환과 3D 모델 뷰어, 다양한 미디어 콘텐츠를 제공합니다.

## 기술 스택

### 핵심 프레임워크
- **React 19.0.0** - UI 라이브러리
- **Vite 6.3.1** - 빌드 도구 및 개발 서버
- **React Router DOM 7.8.0** - 라우팅

### 3D 그래픽스
- **Three.js 0.160.0** - 3D 렌더링 엔진
- **@react-three/fiber 9.3.0** - React용 Three.js 렌더러
- **@react-three/drei 10.7.6** - Three.js 유틸리티 라이브러리
  - Draco 압축 모델 지원
  - OrbitControls, Environment 등 제공

### UI/UX
- **react-pageflip 2.0.3** - 플립북 페이지 전환 효과
- **Tailwind CSS 4.1.11** - 유틸리티 기반 CSS 프레임워크
- **lucide-react 0.501.0** - 아이콘 라이브러리
- **video.js 8.23.4** - 비디오 플레이어

### 챗봇
- **Dialogflow Messenger** - Google Dialogflow 기반 챗봇 통합

## 프로젝트 구조

```
FrienderFlipPdf/
├── public/
│   ├── FrienderFile/          # Friender 카탈로그 리소스
│   │   ├── 3DModel/           # 3D 모델 파일 (.glb)
│   │   ├── Page/              # SVG 페이지 이미지
│   │   ├── Popup/             # 팝업 이미지
│   │   ├── VideoFile/         # GIF 애니메이션
│   │   └── Friender-Pdf/      # PDF 카탈로그
│   └── draco/                 # Draco 압축 디코더
├── src/
│   ├── components/
│   │   ├── FrienderPage.jsx          # 데스크톱 메인 컴포넌트
│   │   ├── FrienderPage-mobile.jsx   # 모바일 메인 컴포넌트
│   │   ├── Frender3DModel.jsx        # 3D 모델 뷰어
│   │   └── Chatbot.jsx               # Dialogflow 챗봇
│   ├── hooks/
│   │   └── useDfMessenger.js         # Dialogflow 이벤트 훅
│   ├── App.jsx                       # 루트 컴포넌트
│   ├── main.jsx                      # 애플리케이션 진입점
│   └── index.css                     # 전역 스타일
├── vite.config.js                    # Vite 설정
├── tailwind.config.js                # Tailwind CSS 설정
└── package.json                      # 프로젝트 의존성
```

## 주요 기능

### 1. 플립북 페이지 전환
- `react-pageflip`을 사용한 책 넘기기 효과
- 11개의 SVG 페이지로 구성된 카탈로그
- 키보드 및 마우스 네비게이션 지원
- 반응형 플립북 크기 조정 (화면 크기의 40%, 최소 400px, 최대 800px)

### 2. 3D 모델 뷰어
- Three.js 기반 3D 모델 렌더링
- Draco 압축 모델 지원 (CDN 기반 디코더)
- 인터랙티브 파트 하이라이트 기능
- OrbitControls를 통한 모델 조작 (회전, 확대/축소, 이동)
- 모바일/데스크톱 반응형 컨트롤

### 3. 반응형 디자인
- 데스크톱: 플립북 스타일 인터페이스 (1025px 이상)
- 모바일: 스크롤 기반 페이지 네비게이션 (1025px 미만)
- 화면 크기 변경 시 자동 레이아웃 조정

### 4. 인터랙티브 콘텐츠
- **팝업 모달**: 페이지별 클릭 가능 영역에 대한 상세 이미지 표시
- **YouTube 비디오**: 드론 교육 영상 플레이리스트 임베드
- **GIF 애니메이션**: 페이지별 동적 콘텐츠 표시
- **이미지 확대/축소**: 모달 내 이미지 줌 및 드래그 기능
- **미니맵**: 확대된 이미지의 네비게이션 가이드

### 5. 초기 로딩 애니메이션
- 로고 페이드인 애니메이션 (1초, ease-out)
- 흰 화면에서 본 화면으로의 전환 효과
- 표지 페이지 GIF 자동 재생 (3.2초)

### 6. Dialogflow 챗봇
- Google Dialogflow Messenger 통합
- 사용자/봇 메시지 이벤트 구독
- CX 및 ES 구조 모두 지원
- 커스텀 스타일링 적용

### 7. 외부 서비스 통합
- **네이버 지도**: 회사 위치 표시 및 공유 기능
- **YouTube API**: 비디오 임베드 및 재생
- **PDF 뷰어**: 카탈로그 PDF 다운로드 및 인쇄

## 개발 환경 설정

### 필수 요구사항
- Node.js (권장: 18.x 이상)
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 빌드 설정

### Vite 설정
- React 플러그인 사용
- History API Fallback 활성화
- 단일 청크 빌드 (manualChunks 비활성화)

### Tailwind CSS
- JIT 모드 활성화
- `index.html` 및 `src/**/*.{js,jsx,ts,tsx}` 파일 스캔

## 주요 컴포넌트 설명

### FrienderPage.jsx
데스크톱 환경의 메인 컴포넌트입니다.
- 플립북 페이지 관리
- 페이지별 인터랙티브 영역 처리
- 모달 및 팝업 상태 관리
- 확대/축소 및 드래그 기능
- YouTube 비디오 플레이리스트 관리

### FrienderPage-mobile.jsx
모바일 환경의 메인 컴포넌트입니다.
- 스크롤 기반 페이지 네비게이션
- 모바일 최적화된 레이아웃
- 터치 제스처 지원

### Frender3DModel.jsx
3D 모델 뷰어 컴포넌트입니다.
- GLB/GLTF 모델 로딩
- 하이라이트 박스 시스템 (4개 파트)
- 애니메이션 제어
- 로딩 상태 관리
- 모바일/데스크톱 컨트롤 분기

### Chatbot.jsx
Dialogflow 챗봇 통합 컴포넌트입니다.
- df-messenger 스크립트 동적 로드
- 이벤트 리스너 설정
- 메시지 파싱 및 전달
- 커스텀 스타일링

## 상태 관리

컴포넌트는 React의 `useState`와 `useRef`를 사용하여 로컬 상태를 관리합니다:
- 페이지 네비게이션 상태
- 모달 열림/닫힘 상태
- 확대/축소 레벨
- 드래그 오프셋
- 호버 상태
- 비디오 재생 상태

## 성능 최적화

1. **코드 스플리팅**: Vite의 자동 코드 스플리팅 활용
2. **이미지 최적화**: SVG 형식 사용으로 벡터 그래픽 제공
3. **3D 모델 압축**: Draco 압축으로 모델 크기 감소
4. **지연 로딩**: Suspense를 통한 3D 모델 비동기 로딩
5. **이벤트 리스너 최적화**: useEffect cleanup을 통한 메모리 누수 방지

## 브라우저 호환성

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 배포

프로젝트는 Netlify를 통해 배포되며, `netlify.toml` 설정 파일이 포함되어 있습니다.

```bash
# 빌드 후 dist 폴더를 Netlify에 배포
npm run build
```

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
