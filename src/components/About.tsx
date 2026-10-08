const INTRO: string[] = [
  '사용자의 불편을 구조로 푸는 UI 디자이너입니다.',
  '리디자인과 웹 디자인을 중심으로, 문제를 정의하고 근거를 세워 결과로 이어지는 과정을 중요하게 생각합니다.',
  '작업물이 먼저 읽히도록 정렬, 타이포그래피, 여백 같은 디테일을 절제해서 다듬습니다.',
]

const KEYWORDS: string[] = ['문제 정의', '근거 기반 설계', '리디자인', '웹 디자인']

const TOOLS: string[] = ['Figma']

function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <h2 id="about-title" className="about__title">
        About
      </h2>

      <div className="about__intro">
        {INTRO.map((sentence) => (
          <p key={sentence} className="about__text">
            {sentence}
          </p>
        ))}
      </div>

      <div className="about__group">
        <h3 className="about__subtitle">강점 키워드</h3>
        <ul className="about__list">
          {KEYWORDS.map((keyword) => (
            <li key={keyword} className="about__item">
              {keyword}
            </li>
          ))}
        </ul>
      </div>

      <div className="about__group">
        <h3 className="about__subtitle">사용 툴</h3>
        <ul className="about__list">
          {TOOLS.map((tool) => (
            <li key={tool} className="about__item">
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default About
