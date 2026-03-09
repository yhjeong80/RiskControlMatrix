# RCM Portal - JSON Data Model Version

이 버전은 기존 `rcmData.js` 하드코딩 구조 대신 아래 JSON 파일을 직접 읽도록 변경한 버전입니다.

## data 폴더
- users.json
- folders.json
- risks.json
- controls.json
- change_logs.json

## 주요 변경점
- 선택된 폴더 기준으로 상위 / 하위 폴더 생성
- Manager 계정만 폴더 생성 / 삭제 / 리스크 수정 가능
- 폴더 삭제 시 confirm 팝업 표시
- risks.json 구조를 기준으로 Risk 테이블 표시
- 변경 내용은 LocalStorage에 저장
- JSON / CSV / XLSX Export 지원

## 로그인
- Manager / 0000
- User / 0000

## 주의
정적 GitHub Pages 버전이므로 브라우저에서 수정한 내용은 원본 JSON 파일을 직접 바꾸지 않습니다.
운영 단계에서는 DB/API 연동 구조로 전환하는 것을 권장합니다.
