import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Battle from './pages/Battle'
import PokemonDetail from './pages/PokemonDetail'
import Posts from './pages/Posts'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </>
  )
}

export default App