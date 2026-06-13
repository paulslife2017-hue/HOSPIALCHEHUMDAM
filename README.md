# Korea Experience — 외국인 체험단 사이트

## 프로젝트 개요
- **이름**: Korea Experience
- **목표**: 외국인 SNS 인플루언서를 대상으로 한국 장소(맛집, 문화, 카페 등) 체험단을 모집하는 플랫폼
- **주요 기능**: Google Places API 장소 검색, 체험단 지원, 관리자 대시보드

## URL
- **로컬**: http://localhost:3000
- **메인 페이지**: /
- **관리자 로그인**: /admin
- **관리자 대시보드**: /admin/dashboard

## API 엔드포인트
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/campaigns | 전체 캠페인 목록 |
| GET | /api/campaigns/:id | 캠페인 상세 |
| GET | /api/places/search?q= | Google Places 검색 |
| GET | /api/places/details/:placeId | 장소 상세 정보 |
| GET | /api/places/photo?ref= | 장소 사진 프록시 |
| POST | /api/apply | 체험단 지원 제출 |
| POST | /api/admin/login | 관리자 로그인 |
| GET | /api/admin/applications | 지원자 목록 (관리자) |
| PATCH | /api/admin/applications/:id | 지원 상태 변경 |
| GET | /api/admin/campaigns | 캠페인 목록 (관리자) |
| POST | /api/admin/campaigns | 캠페인 등록 |
| DELETE | /api/admin/campaigns/:id | 캠페인 비활성화 |

## 데이터 아키텍처
- **Storage**: Cloudflare D1 (SQLite)
- **Tables**:
  - `campaigns`: 체험단 캠페인 정보 (장소 정보, 모집 인원, 마감일 포함)
  - `applications`: 지원자 정보 (SNS 계정, 팔로워 수, 지원 동기 포함)
  - `admins`: 관리자 계정

## 사용 방법

### 일반 사용자
1. 메인 페이지에서 모집 중인 체험단 확인
2. 카테고리 필터로 원하는 종류의 캠페인 검색
3. 캠페인 카드 클릭으로 상세 정보 확인
4. "지원하기" 버튼 클릭 후 정보 입력 및 제출

### 관리자
- 기본 계정: `admin` / `admin1234`
1. `/admin`에서 로그인
2. 지원자 목록 확인 및 승인/거절 처리
3. 캠페인 등록: Google Places로 장소 검색 후 캠페인 정보 입력
4. 캠페인 현황 관리

## Google Places API 설정
`.dev.vars` 파일에 API 키 입력:
```
GOOGLE_PLACES_API_KEY=your_api_key_here
```
- API 키 발급: https://console.cloud.google.com/apis/credentials
- 활성화 필요 API: Places API, Maps JavaScript API

## 배포 정보
- **플랫폼**: Cloudflare Pages
- **상태**: 개발 중
- **기술 스택**: Hono + TypeScript + Cloudflare D1 + TailwindCSS
- **최종 업데이트**: 2026-06-13
