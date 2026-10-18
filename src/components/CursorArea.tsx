import { useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'

type CursorAreaProps = {
  label: string // 커서에 표시할 문구이자 링크 이름
  href: string
  className?: string
  children: ReactNode
}

// 영역에 마우스를 올리면 기본 포인터 대신 문구가 적힌 커서가 따라다니고, 영역 전체가 링크가 됨
// (레퍼런스: docs/memo.md 비쥬얼스토리 커스텀 커서).
// 마우스가 없는 기기에서는 커서 대신 링크가 평범한 텍스트 링크로 보인다 (App.css).
function CursorArea({ label, href, className, children }: CursorAreaProps) {
  const cursorRef = useRef<HTMLSpanElement>(null)

  // 위치는 매 프레임 바뀌므로 state 대신 스타일을 직접 바꿔 리렌더를 피함
  const moveCursor = (event: PointerEvent<HTMLDivElement>) => {
    const cursor = cursorRef.current
    if (!cursor || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    cursor.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
    cursor.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
    event.currentTarget.classList.add('is-active')
  }

  const hideCursor = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('is-active')
  }

  return (
    <div
      className={className ? `cursor-area ${className}` : 'cursor-area'}
      onPointerMove={moveCursor}
      onPointerLeave={hideCursor}
    >
      {children}
      <a href={href} className="cursor-area__link">
        {label}
      </a>
      {/* 바깥은 위치만, 안쪽은 나타날 때의 크기 변화만 맡아 서로 간섭하지 않게 함 */}
      <span ref={cursorRef} className="cursor-area__cursor" aria-hidden="true">
        <span className="cursor-area__bubble">{label}</span>
      </span>
    </div>
  )
}

export default CursorArea
