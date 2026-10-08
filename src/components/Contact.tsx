import { useState } from 'react'

type ContactLink = {
  label: string
  url: string
}

type ContactInfo = {
  email: string // 유일한 필수 항목
  resumeUrl?: string // 이력서 PDF 경로. 비워 두면 숨김
  links?: ContactLink[] // Behance / LinkedIn / 노션 등. 비워 두면 숨김
}

// 값을 채우면 해당 항목이 나타나고, 비워 두면 숨겨집니다.
const CONTACT: ContactInfo = {
  email: 'your-email@example.com', // TODO: 실제 이메일로 교체
  resumeUrl: undefined, // 예: '/resume.pdf' (public/ 폴더에 PDF를 넣고 경로 입력)
  links: [], // 예: [{ label: 'Behance', url: 'https://www.behance.net/...' }]
}

function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact__title">
        Contact
      </h2>

      <div className="contact__email">
        <a href={`mailto:${CONTACT.email}`} className="contact__email-link">
          {CONTACT.email}
        </a>
        <button type="button" className="contact__copy" onClick={handleCopy}>
          {copied ? '복사됨' : '이메일 복사'}
        </button>
        <span className="contact__status" role="status" aria-live="polite">
          {copied ? '이메일 주소가 복사되었습니다.' : ''}
        </span>
      </div>

      {(CONTACT.resumeUrl || (CONTACT.links && CONTACT.links.length > 0)) && (
        <ul className="contact__list">
          {CONTACT.resumeUrl && (
            <li className="contact__item">
              <a href={CONTACT.resumeUrl} className="contact__link" download>
                이력서 PDF 다운로드
              </a>
            </li>
          )}
          {CONTACT.links?.map((link) => (
            <li key={link.url} className="contact__item">
              <a
                href={link.url}
                className="contact__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Contact
