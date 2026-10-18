import { Link } from 'react-router'

type NavItem = {
  label: string
  hash: string // 메인 페이지의 섹션 id
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', hash: '#projects' },
  { label: 'About', hash: '#about' },
  { label: 'Contact', hash: '#contact' },
]

// 카테고리 페이지 등 다른 화면에서 눌러도 메인의 해당 섹션으로 이동하도록 경로('/')까지 지정
function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="포트폴리오 홈으로 이동">
        Portfolio
      </Link>
      <nav className="header__nav" aria-label="주요 메뉴">
        <ul className="header__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.hash} className="header__item">
              <Link to={{ pathname: '/', hash: item.hash }} className="header__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
