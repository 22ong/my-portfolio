type NavItem = {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function Header() {
  return (
    <header className="header">
      <a href="#hero" className="header__logo" aria-label="포트폴리오 홈으로 이동">
        Portfolio
      </a>
      <nav className="header__nav" aria-label="주요 메뉴">
        <ul className="header__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="header__item">
              <a href={item.href} className="header__link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
