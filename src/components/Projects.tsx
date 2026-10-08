type ProjectCategory = 'redesign' | 'project'

type Project = {
  slug: string // URL과 이미지 폴더 이름 (영문 소문자·하이픈)
  order: number // 노출 순서 (작을수록 앞)
  title: string
  summary: string // 카드용 한 줄 요약
  category: ProjectCategory
  role?: string // 팀 작업일 때 카드에 표시할 역할
  thumbnail?: string // 없으면 자리표시 영역을 보여줌
}

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  redesign: '개인 리디자인',
  project: '프로젝트',
}

// 항목을 추가하려면 아래 배열에 객체 하나만 더하면 됩니다.
const PROJECTS: Project[] = [
  {
    slug: 'cheongju-family-center',
    order: 1,
    title: '청주시 가족센터 리디자인',
    summary: '청주시 가족센터 웹사이트의 문제점을 분석해 구조와 화면을 개선한 리디자인',
    category: 'redesign',
    thumbnail: '/generated/projects/cheongju-family-center/thumbnail-960.webp',
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

function Projects() {
  const sortedProjects = [...PROJECTS].sort((a, b) => a.order - b.order)

  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="projects__title">
        Projects
      </h2>

      <ul className="projects__list">
        {sortedProjects.map((project) => (
          <li key={project.slug} className="project-card">
            <a href={`/projects/${project.slug}`} className="project-card__link">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt=""
                  width={960}
                  height={600}
                  loading="lazy"
                  className="project-card__thumbnail"
                />
              ) : (
                <div className="project-card__thumbnail project-card__thumbnail--empty" />
              )}
              <span className="project-card__tag">{CATEGORY_LABEL[project.category]}</span>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__summary">{project.summary}</p>
              {project.role && <p className="project-card__role">{project.role}</p>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Projects
