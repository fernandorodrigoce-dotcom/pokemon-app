import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Battle from './pages/Battle'
import PokemonDetail from './pages/PokemonDetail'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/battle" element={<Battle />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
    </Routes>
  )
}

export default App