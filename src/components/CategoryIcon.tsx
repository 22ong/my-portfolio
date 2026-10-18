import type { ProjectCategory } from '../content/projects'

type CategoryIconProps = {
  category: ProjectCategory
  className?: string
}

// 카테고리 타일 앞면의 아이콘 (64 × 64).
// 색은 App.css에서 카테고리별 --tile-ink(선·배지)와 --tile-tint(면)로 칠함.
// 세 아이콘 모두 오른쪽 아래에 같은 동그란 배지를 두어 한 세트로 보이게 함
function CategoryIcon({ category, className }: CategoryIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className ? `category-icon ${className}` : 'category-icon'}
      aria-hidden="true"
    >
      {category === 'redesign' && (
        <>
          {/* 뒤: 기존 화면 / 앞: 새로 그린 화면 */}
          <rect x="5" y="9" width="40" height="32" rx="8" className="category-icon__tint" />
          <rect x="14" y="17" width="42" height="34" rx="8" className="category-icon__paper" />
          <path d="M14 25.5 H56" className="category-icon__line" />
          <circle cx="19" cy="21.3" r="1.3" className="category-icon__dot" />
          <circle cx="23.5" cy="21.3" r="1.3" className="category-icon__dot" />
          <rect x="20" y="31" width="11" height="13" rx="3" className="category-icon__fill" />
          <path d="M36 32.5 H50 M36 38 H48 M36 43.5 H42" className="category-icon__line" />
          {/* 배지: 다시 그리기 ↻ */}
          <circle cx="50" cy="48" r="10" className="category-icon__badge" />
          <path d="M45 48 a5 5 0 1 0 1.6 -3.7" className="category-icon__mark" />
          <path d="M49.6 44.4 L46.6 44.3 L46.7 41.3" className="category-icon__mark" />
        </>
      )}

      {category === 'project' && (
        <>
          {/* 3단으로 쌓인 레이어: 아래부터 그림 */}
          <path d="M8 40 L30 29 L52 40 L30 51 Z" className="category-icon__tint" />
          <path d="M8 32 L30 21 L52 32 L30 43 Z" className="category-icon__fill-soft" />
          <path d="M8 24 L30 13 L52 24 L30 35 Z" className="category-icon__paper" />
          <path d="M23 24 L30 20.5 L37 24 L30 27.5 Z" className="category-icon__fill" />
          {/* 배지: 완성 ✓ */}
          <circle cx="50" cy="48" r="10" className="category-icon__badge" />
          <path d="M45.5 48.2 L48.6 51.2 L54.5 45" className="category-icon__mark" />
        </>
      )}

      {category === 'vibe-coding' && (
        <>
          {/* 뒤: 그림자 말풍선 / 앞: 코드가 담긴 말풍선 */}
          <rect x="13" y="17" width="44" height="30" rx="10" className="category-icon__tint" />
          <path
            d="M18 10 H40 A10 10 0 0 1 50 20 V32 A10 10 0 0 1 40 42 H25 L15 50 L17 42 A10 10 0 0 1 7 32 V20 A10 10 0 0 1 18 10 Z"
            className="category-icon__paper"
          />
          <path
            d="M21 20.5 L15.5 26 L21 31.5 M30.5 19 L26 33 M35.5 20.5 L41 26 L35.5 31.5"
            className="category-icon__line"
          />
          {/* 배지: 반짝 ✦ */}
          <circle cx="50" cy="48" r="10" className="category-icon__badge" />
          <path
            d="M50 42.5 Q51.4 46.6 55.5 48 Q51.4 49.4 50 53.5 Q48.6 49.4 44.5 48 Q48.6 46.6 50 42.5 Z"
            className="category-icon__mark category-icon__mark--solid"
          />
        </>
      )}
    </svg>
  )
}

export default CategoryIcon
