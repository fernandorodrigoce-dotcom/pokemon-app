import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Battle from './pages/Battle'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/battle" element={<Battle />} />
    </Routes>
  )
}

export default App