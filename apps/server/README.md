# PlaceNote Server

PlaceNote의 백엔드 서버 API입니다.

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Supabase 프로젝트

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 변수들을 설정하세요:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Location Configuration
DEFAULT_RADIUS=50 # meters
MAX_RADIUS=1000 # meters
```

## API 엔드포인트

### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

### 메모
- `GET /memos/nearby` - 주변 메모 조회
- `POST /memos` - 메모 작성
- `GET /memos/:id` - 메모 상세 조회
- `PUT /memos/:id` - 메모 수정
- `DELETE /memos/:id` - 메모 삭제

### 위치
- `POST /session/verify-location` - 위치 인증
- `GET /session/status` - 세션 상태 확인

### 커뮤니티
- `GET /places/:id/community/posts` - 커뮤니티 글 목록
- `POST /places/:id/community/posts` - 커뮤니티 글 작성
- `POST /community/posts/:id/comments` - 댓글 작성

## 개발 가이드

### 디렉토리 구조

```
src/
├── controllers/    # 라우트 컨트롤러
├── services/       # 비즈니스 로직
├── models/         # 데이터 모델
├── middleware/     # 미들웨어
├── config/         # 설정 파일
└── utils/          # 유틸리티 함수
```

### 코드 스타일

- TypeScript strict 모드 사용
- ESLint와 Prettier 설정 준수
- Jest를 사용한 단위 테스트 작성 