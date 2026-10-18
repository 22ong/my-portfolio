export type ProjectCategory = 'redesign' | 'project' | 'vibe-coding'

export type Project = {
  slug: string // URL과 이미지 폴더 이름 (영문 소문자·하이픈)
  order: number // 카테고리 안에서의 노출 순서 (작을수록 앞)
  title: string
  summary: string // 한 줄 요약
  category: ProjectCategory
  role?: string // 팀 작업일 때 표시할 역할
  thumbnail?: string
}

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  redesign: '리디자인',
  project: '프로젝트',
  'vibe-coding': '바이브코딩',
}

// 메인 타일이 놓이는 순서. 프로젝트가 없어도 세 개 모두 보여 줌 (와이어프레임.md P2)
export const CATEGORY_ORDER: ProjectCategory[] = ['redesign', 'project', 'vibe-coding']

// 항목을 추가하려면 아래 배열에 객체 하나만 더하면 됩니다.
// 메인 타일과 카테고리 페이지(/category/<category>)에 자동으로 반영됨
export const PROJECTS: Project[] = [
  {
    slug: 'cheongju-family-center',
    order: 1,
    title: '청주시 가족센터 리디자인',
    summary: '청주시 가족센터 웹사이트의 문제점을 분석해 구조와 화면을 개선한 리디자인',
    category: 'redesign',
    thumbnail: `${import.meta.env.BASE_URL}generated/projects/cheongju-family-center/thumbnail-960.webp`,
  },
  // TODO: 실제 프로젝트 정보로 교체
  {
    slug: 'redesign-02',
    order: 2,
    title: '리디자인 프로젝트 2',
    summary: '프로젝트 한 줄 요약을 입력하세요',
    category: 'redesign',
  },
  // TODO: 실제 프로젝트 정보로 교체
  {
    slug: 'redesign-03',
    order: 3,
    title: '리디자인 프로젝트 3',
    summary: '프로젝트 한 줄 요약을 입력하세요',
    category: 'redesign',
  },
]

export const isProjectCategory = (value: string | undefined): value is ProjectCategory =>
  CATEGORY_ORDER.some((category) => category === value)

export const getProjectsByCategory = (category: ProjectCategory): Project[] =>
  PROJECTS.filter((project) => project.category === category).sort((a, b) => a.order - b.order)

export const formatCount = (count: number) => String(count).padStart(2, '0')
