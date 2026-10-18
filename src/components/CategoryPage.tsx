import { Link, useParams } from 'react-router'
import {
  CATEGORY_LABEL,
  formatCount,
  getProjectsByCategory,
  isProjectCategory,
} from '../content/projects'
import NotFound from './NotFound'

// 메인 카테고리 타일을 누르면 오는 화면. 그 카테고리의 프로젝트를 카드 그리드로 보여 줌
// (와이어프레임.md 14절, 카드는 요구사항 D26·D32)
function CategoryPage() {
  const { category } = useParams()
  if (!isProjectCategory(category)) return <NotFound />

  const label = CATEGORY_LABEL[category]
  const projects = getProjectsByCategory(category)

  return (
    <section className={`category-page category-page--${category}`} aria-labelledby="category-title">
      <Link to={{ pathname: '/', hash: '#projects' }} className="category-page__back">
        ← Projects
      </Link>

      <h1 id="category-title" className="category-page__title">
        {label}{' '}
        <span className="category-page__count">{formatCount(projects.length)}</span>
      </h1>

      {projects.length === 0 ? (
        <p className="category-page__empty">준비 중이에요</p>
      ) : (
        <ul className="category-page__list">
          {projects.map((project) => (
            <li key={project.slug} className="project-card">
              <Link to={`/projects/${project.slug}`} className="project-card__link">
                {/* 바깥 유리 테두리(media) 안에 썸네일 액자(frame) */}
                <span className="project-card__media">
                  <span className="project-card__frame">
                    {project.thumbnail && (
                      <img
                        src={project.thumbnail}
                        alt=""
                        width={960}
                        height={720}
                        loading="lazy"
                        className="project-card__thumbnail"
                      />
                    )}
                  </span>
                </span>
                <span className="project-card__title">{project.title}</span>
                <span className="project-card__summary">{project.summary}</span>
                {project.role && <span className="project-card__role">{project.role}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CategoryPage
