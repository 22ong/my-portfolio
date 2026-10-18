import { Link } from 'react-router'

// 없는 주소로 들어왔을 때 보여 주는 화면 (요구사항 4.6)
function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="not-found__title">
        페이지를 찾을 수 없어요
      </h1>
      <p className="not-found__text">주소가 바뀌었거나 아직 준비 중인 페이지예요.</p>
      <Link to="/" className="not-found__link">
        메인으로 돌아가기
      </Link>
    </section>
  )
}

export default NotFound
