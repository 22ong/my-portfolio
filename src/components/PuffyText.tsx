import { useId } from 'react'
import type { PointerEvent } from 'react'

type PuffyTextProps = {
  text: string
  className?: string
  decorated?: boolean // 글자 위에 별·하트 장식을 띄울지
}

type Decoration = {
  kind: 'star' | 'heart'
  x: number // 별은 중심, 하트는 왼쪽 위 기준 (viewBox 좌표)
  y: number
  size: number // 별은 반지름, 하트는 배율
  rotate: number
  mobile: boolean // false면 모바일에서 숨김 (와이어프레임 H8: 모바일은 별 1 + 하트 1)
}

// 마우스를 따라 기울어지는 최대 각도(deg). 실제 기울기는 CSS에서 움직임 줄이기 설정을 확인한 뒤 적용함
const MAX_TILT = 10

// 글자는 viewBox 0~900 폭에 맞추고, 위쪽 여백(y < 0)에 장식을 둠
const VIEWBOX = '0 -120 900 300'

// 레퍼런스 구성: 별은 왼쪽 위, 하트는 오른쪽 위에 큰 것·작은 것 한 쌍씩
const DECORATIONS: Decoration[] = [
  { kind: 'star', x: 24, y: -50, size: 62, rotate: 0, mobile: true },
  { kind: 'star', x: 122, y: -88, size: 34, rotate: 12, mobile: false },
  { kind: 'heart', x: 800, y: -82, size: 0.82, rotate: 12, mobile: true },
  { kind: 'heart', x: 712, y: -92, size: 0.5, rotate: -12, mobile: false },
]

// 100 × 88 상자 안의 하트
const HEART_PATH =
  'M50 88 C20 65 0 45 0 25 C0 10 12 0 27 0 C38 0 46 6 50 15 C54 6 62 0 73 0 C88 0 100 10 100 25 C100 45 80 65 50 88 Z'

// 네 갈래 반짝이 별. 가운데로 갈수록 오목하게 휘어 들어감.
// 필터가 뾰족한 끝을 둥글게 깎아 내므로 별을 크게 그리고 끝을 길게 뺌
function sparklePath(cx: number, cy: number, r: number): string {
  const k = r * 0.26
  return [
    `M ${cx} ${cy - r}`,
    `Q ${cx + k} ${cy - k} ${cx + r} ${cy}`,
    `Q ${cx + k} ${cy + k} ${cx} ${cy + r}`,
    `Q ${cx - k} ${cy + k} ${cx - r} ${cy}`,
    `Q ${cx - k} ${cy - k} ${cx} ${cy - r}`,
    'Z',
  ].join(' ')
}

// 흰 구름처럼 부푼 글자 (레퍼런스: docs/logo_rat, 와이어프레임.md H8~H10).
// 라이브러리 없이 SVG 필터만으로 부풀리기 → 털 가장자리 → 조명 → 그림자 순서로 입체감을 만든다.
function PuffyText({ text, className, decorated = false }: PuffyTextProps) {
  // useId 결과의 특수문자는 url(#…) 참조를 깨뜨릴 수 있어 제거
  const filterId = `puffy-${useId().replace(/[^\w-]/g, '')}`

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse') return
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    target.style.setProperty('--tilt-x', `${(-y * MAX_TILT).toFixed(2)}deg`)
    target.style.setProperty('--tilt-y', `${(x * MAX_TILT).toFixed(2)}deg`)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    event.currentTarget.style.removeProperty('--tilt-x')
    event.currentTarget.style.removeProperty('--tilt-y')
  }

  // h1 안에 들어갈 수 있도록 바깥 요소는 span
  return (
    <span
      className={className ? `puffy ${className}` : 'puffy'}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <svg
        className="puffy__svg"
        viewBox={decorated ? VIEWBOX : '0 0 900 170'}
        role="img"
        aria-label={text}
      >
        <defs>
          <filter
            id={filterId}
            x="-5%"
            y="-25%"
            width="110%"
            height="160%"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            {/* 1. 글자를 굵히고 흐린 뒤 다시 또렷하게 잘라 모서리가 둥근 덩어리로 만듦 */}
            <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="fat" />
            <feGaussianBlur in="fat" stdDeviation="8" result="fatBlur" />
            <feComponentTransfer in="fatBlur" result="shape">
              <feFuncA type="linear" slope="14" intercept="-6.5" />
            </feComponentTransfer>

            {/* 2. 노이즈로 가장자리를 흩뜨려 털 같은 테두리 */}
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="shape" stdDeviation="1.2" result="softShape" />
            <feDisplacementMap
              in="softShape"
              in2="noise"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
              result="fur"
            />

            {/* 3. 흐린 모양을 높이로 써서 가운데가 볼록한 면에 왼쪽 위에서 빛을 비춤 */}
            <feGaussianBlur in="shape" stdDeviation="11" result="height" />
            <feDiffuseLighting in="height" surfaceScale="16" diffuseConstant="1" lightingColor="#fff" result="light">
              <feDistantLight azimuth="240" elevation="48" />
            </feDiffuseLighting>

            {/* 4. 밝기를 구름색 단계로 바꿈 (어두운 면 → 파랑 그림자, 밝은 면 → 흰색) */}
            <feComponentTransfer in="light" result="tint">
              <feFuncR type="table" tableValues="0.36 0.62 0.84 0.94 1" />
              <feFuncG type="table" tableValues="0.48 0.72 0.89 0.96 1" />
              <feFuncB type="table" tableValues="0.84 0.93 0.99 1 1" />
            </feComponentTransfer>

            {/* 5. 잔 노이즈를 살짝 섞어 보송한 질감을 낸 뒤 털 테두리 모양으로 자름 */}
            <feColorMatrix in="noise" type="saturate" values="0" result="grain" />
            <feComposite in="tint" in2="grain" operator="arithmetic" k2="1" k3="0.16" k4="-0.08" result="textured" />
            <feComposite in="textured" in2="fur" operator="in" result="body" />

            {/* 6. 아래로 떨어지는 부드러운 파랑 그림자 */}
            <feGaussianBlur in="shape" stdDeviation="12" result="shadowBlur" />
            <feOffset in="shadowBlur" dy="16" result="shadowOffset" />
            <feFlood floodColor="#1a3a99" floodOpacity="0.3" />
            <feComposite in2="shadowOffset" operator="in" result="shadow" />

            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="body" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${filterId})`}>
          {/* 폰트가 바뀌어도 로고 폭이 같도록 textLength로 고정.
              글자 모양은 그대로 두고 자간만 늘려, 부푼 글자끼리 붙지 않게 함 */}
          <text
            className="puffy__text"
            x="0"
            y="130"
            fontSize="140"
            textLength="900"
            lengthAdjust="spacing"
          >
            {text}
          </text>

          {decorated &&
            DECORATIONS.map((deco) => {
              const className = deco.mobile ? 'puffy__deco' : 'puffy__deco puffy__deco--desktop'
              const key = `${deco.kind}-${deco.x}-${deco.y}`
              return deco.kind === 'star' ? (
                <path
                  key={key}
                  className={className}
                  d={sparklePath(deco.x, deco.y, deco.size)}
                  transform={`rotate(${deco.rotate} ${deco.x} ${deco.y})`}
                />
              ) : (
                <path
                  key={key}
                  className={className}
                  d={HEART_PATH}
                  transform={`translate(${deco.x} ${deco.y}) scale(${deco.size}) rotate(${deco.rotate} 50 44)`}
                />
              )
            })}
        </g>
      </svg>
    </span>
  )
}

export default PuffyText
