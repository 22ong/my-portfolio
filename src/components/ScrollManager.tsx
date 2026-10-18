import { useEffect } from 'react'
import { useLocation } from 'react-router'

// 페이지를 옮길 때 스크롤 위치를 맞춤.
// 주소에 #projects 같은 해시가 있으면 그 섹션으로, 없으면 맨 위로 이동한다.
// 다른 페이지에서 헤더의 'Projects'를 눌러 메인으로 돌아와도 해당 섹션이 보이게 하기 위함
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }
    // html의 scroll-behavior: smooth와 상관없이 바로 맨 위로
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, key])

  return null
}

export default ScrollManager
