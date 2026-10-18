import CursorArea from './CursorArea'
import PuffyText from './PuffyText'

type HeroProps = {
  resumeUrl?: string // 이력서 PDF 경로. 없으면 이력서 버튼을 숨김
}

const LOGO = 'My Portfolio'

const NAME = '윤수연'

// 제목 (요구사항 4.1 "히어로"). 데스크톱에서 두 줄로 끊기도록 줄 단위로 나눔
const TITLE_LINES: string[] = ['이해하기 쉽고,', '기억에 남는 화면을 디자인합니다.']

const INTRO = '정보의 흐름은 자연스럽게, 브랜드의 매력은 선명하게 전달합니다.'

// 3D 로고 중심 레이아웃 (요구사항 D36, 와이어프레임.md H1~H13)
function Hero({ resumeUrl }: HeroProps) {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__logo">
          <PuffyText text={LOGO} decorated />
        </h1>
        <p className="hero__name">
          <span className="hero__name-by">by.</span> {NAME}
        </p>

        {/* 제목·소개에 마우스를 올리면 '프로젝트 보기' 커서가 나타나고, 누르면 프로젝트로 이동 */}
        <CursorArea label="프로젝트 보기" href="#projects" className="hero__copy">
          <p className="hero__title">
            {TITLE_LINES.map((line) => (
              <span key={line} className="hero__title-line">
                {line}
              </span>
            ))}
          </p>
          <p className="hero__intro">{INTRO}</p>
        </CursorArea>

        {resumeUrl && (
          <div className="hero__actions">
            <a href={resumeUrl} className="hero__cta hero__cta--secondary" download>
              이력서
            </a>
          </div>
        )}
      </div>

      <a href="#projects" className="hero__scroll" aria-label="프로젝트로 이동">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v15M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  )
}

export default Hero
