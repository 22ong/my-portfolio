import { Route, Routes } from 'react-router'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CategoryPage from './components/CategoryPage'
import NotFound from './components/NotFound'
import ScrollManager from './components/ScrollManager'
import './App.css'

function App() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Projects />
                <About />
                <Contact />
              </>
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          {/* 프로젝트 상세(/projects/:slug)는 아직 없어서 404로 보냄 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
