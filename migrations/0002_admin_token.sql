-- admins 테이블에 current_token 컬럼 추가
-- isAdmin() DB 검증을 위해 로그인 시 발급된 토큰을 저장
ALTER TABLE admins ADD COLUMN current_token TEXT;
