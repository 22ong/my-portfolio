# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에 제공하는 가이드입니다.

## 작업 규칙

- Vite + React + TypeScript 프로젝트임
- 컴포넌트 파일은 src/components/ 에 .tsx 로 만들 것
- 한 번에 파일 하나만 작업할 것
- 외부 라이브러리를 새로 설치해야할 경우, 어떤 이유로 필요한지 사용자에게 설명할 것
- any 타입을 쓰지 말 것
- CSS는 src/App.css 한 곳에만 작성할 것
- 파일을 지우거나 이름을 바꾸기 전에 먼저 물어볼 것
- 작업이 끝나면 무엇을 바꿨는지 한국어로 두세 줄 요약할 것

## 명령어

- `npm run dev` — Vite 개발 서버 (기본 포트 5173, 사용 중이면 다음 빈 포트를 자동 선택)
- `npm run build` — `tsc -b` 타입 검사 후 `vite build` 실행. 타입 검사에 실패하면 빌드도 실패함
- `npm run lint` — Oxlint 실행 (ESLint 아님). 설정은 `.oxlintrc.json`
- `npm run preview` — 프로덕션 빌드 결과물 미리보기

테스트 러너는 설정되어 있지 않습니다.

## 스택 및 아키텍처

React 19 + TypeScript + Vite 8 기반 싱글 페이지 앱으로, 현재는 수정되지 않은 Vite 스타터 템플릿 상태입니다. (`src/main.tsx`가 `src/App.tsx`를 마운트하며, 라우팅·상태 관리·추가 의존성은 아직 없음.) `/icons.svg`, `favicon.svg`처럼 `/…` URL로 참조하는 정적 에셋은 `public/`에, 컴포넌트에서 import하는 이미지는 `src/assets/`에 있습니다.

## 도구 관련 참고 사항

- TypeScript 설정은 `tsconfig.app.json`(`src` 코드)과 `tsconfig.node.json`(Vite 설정)으로 나뉘며 `tsconfig.json`에서 참조합니다. 주의할 옵션: `noUnusedLocals`/`noUnusedParameters`는 오류로 처리되고, `verbatimModuleSyntax` 때문에 타입 전용 import는 `import type`을 써야 하며, `erasableSyntaxOnly`로 인해 enum, namespace, 생성자 매개변수 프로퍼티는 사용할 수 없습니다.
- Oxlint는 `react/rules-of-hooks`(error)와 `react/only-export-components`(warn)를 적용합니다. 타입 인식(type-aware) 린팅은 켜져 있지 않습니다.
- React Compiler는 의도적으로 활성화하지 않았습니다.
