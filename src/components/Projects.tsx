import { Link } from 'react-router'
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  formatCount,
  getProjectsByCategory,
} from '../content/projects'
import CategoryIcon from './CategoryIcon'

// 프로젝트 데이터는 src/content/projects.ts에서 관리
const CATEGORY_GROUPS = CATEGORY_ORDER.map((category) => ({
  category,
  projects: getProjectsByCategory(category),
}))

// 뒷면에 보여 줄 최대 개수. 넘으면 '외 N개'로 줄임 (P4)
const MAX_PREVIEW = 5

// 네 갈래 반짝이 별 (Hero 장식과 같은 모양, 24 × 24 상자)
const STAR_PATH = 'M12 0 Q15.1 8.9 24 12 Q15.1 15.1 12 24 Q8.9 15.1 0 12 Q8.9 8.9 12 0 Z'

const STARS = [1, 2, 3]

// 메인에는 카테고리 타일 3개만 보이고, 마우스를 올리면 3D로 뒤집혀 뒷면에 프로젝트 목록이 나타남
// (레퍼런스: docs/memo.md think thing thank · 비쥬얼스토리, 와이어프레임.md 9~16절).
// 회전·별은 App.css에서 처리하며, 호버가 없는 기기에서는 앞면만 보인다.
function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="projects__title">
        Projects
      </h2>

      <ul className="projects__tiles">
        {CATEGORY_GROUPS.map(({ category, projects }) => {
          const label = CATEGORY_LABEL[category]
          const categoryUrl = `/category/${category}`
          const isEmpty = projects.length === 0

          return (
            <li
              key={category}
              className={`category-tile category-tile--${category}${isEmpty ? ' category-tile--empty' : ''}`}
            >
              <div className="category-tile__card">
                <div className="category-tile__face category-tile__face--front">
                  {/* 하얀 클레이 버튼 위에 올린 아이콘 (레퍼런스: docs/card_rat) */}
                  <span className="category-tile__icon">
                    <CategoryIcon category={category} />
                  </span>
                  <h3 className="category-tile__name">
                    {/* 링크의 클릭 영역은 CSS로 앞면 전체로 넓힘. 빈 카테고리는 이동하지 않음 (P7) */}
                    {isEmpty ? (
                      label
                    ) : (
                      <Link to={categoryUrl} className="category-tile__link">
                        {label}
                      </Link>
                    )}
                  </h3>
                  <span className="category-tile__count">{formatCount(projects.length)}</span>
                </div>

                <div className="category-tile__face category-tile__face--back">
                  {/* 앞면과 같은 내용이라 스크린 리더에서는 한 번만 읽게 숨김 */}
                  <p className="category-tile__heading" aria-hidden="true">
                    {label}
                    <span className="category-tile__count">{formatCount(projects.length)}</span>
                  </p>

                  {isEmpty ? (
                    <p className="category-tile__empty">준비 중이에요</p>
                  ) : (
                    <>
                      {/* 제목을 누르면 바로 상세로 이동 → 메인에서 클릭 1번이면 시안 (P6) */}
                      <ul className="category-tile__list">
                        {projects.slice(0, MAX_PREVIEW).map((project) => (
                          <li key={project.slug}>
                            <Link to={`/projects/${project.slug}`} className="category-tile__project">
                              {project.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {projects.length > MAX_PREVIEW && (
                        <p className="category-tile__more">외 {projects.length - MAX_PREVIEW}개</p>
                      )}
                      <Link to={categoryUrl} className="category-tile__all">
                        전체 보기 →
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* 호버·포커스 표시 (P10) */}
              <span className="category-tile__stars" aria-hidden="true">
                {STARS.map((star) => (
                  <svg
                    key={star}
                    viewBox="0 0 24 24"
                    className={`category-tile__star category-tile__star--${star}`}
                  >
                    <path d={STAR_PATH} />
                  </svg>
                ))}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Projects
