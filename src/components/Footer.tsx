type FooterLink = {
  label: string
  url: string
}

type FooterProps = {
  email?: string // 있으면 mailto 링크를 표시
  links?: FooterLink[] // SNS·외부 링크. 없으면 숨김
}

const YEAR = new Date().getFullYear()

function Footer({ email, links }: FooterProps) {
  return (
    <footer className="footer">
      <nav className="footer__nav" aria-label="푸터 메뉴">
        <ul className="footer__list">
          <li className="footer__item">
            <a href="#contact" className="footer__link">
              Contact
            </a>
          </li>
          {email && (
            <li className="footer__item">
              <a href={`mailto:${email}`} className="footer__link">
                {email}
              </a>
            </li>
          )}
          {links?.map((link) => (
            <li key={link.url} className="footer__item">
              <a
                href={link.url}
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="footer__copyright">© {YEAR} Portfolio</p>
    </footer>
  )
}

export default Footer
