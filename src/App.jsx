import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Battle from './pages/Battle'
import PokemonDetail from './pages/PokemonDetail'
import Posts from './pages/Posts'
import PvP from './pages/PvP'
import Admin from './pages/Admin'
import Navbar from './components/funcionespagina/Navbar'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/pvp" element={<PvP />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App