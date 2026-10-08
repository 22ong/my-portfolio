type HeroProps = {
  resumeUrl?: string // 이력서 PDF 경로. 없으면 이력서 버튼을 숨김
}

const NAME = '이름' // TODO: 실제 이름으로 교체
const TAGLINE = '사용자의 불편을 구조로 푸는 UI 디자이너' // 문구 미확정 (요구사항 4.1)

function Hero({ resumeUrl }: HeroProps) {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <p className="hero__name">{NAME}</p>
      <h1 id="hero-title" className="hero__title">
        {TAGLINE}
      </h1>

      <div className="hero__actions">
        <a href="#projects" className="hero__cta hero__cta--primary">
          프로젝트 보기
        </a>
        {resumeUrl && (
          <a href={resumeUrl} className="hero__cta hero__cta--secondary" download>
            이력서
          </a>
        )}
      </div>
    </section>
  )
}

export default Hero
