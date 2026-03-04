import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex gap-6">
      <Link to="/" className="hover:text-yellow-400">Pokédex</Link>
      <Link to="/posts" className="hover:text-yellow-400">Posts</Link>
      <Link to="/battle" className="hover:text-yellow-400">Batalla</Link>
    </nav>
  )
}

export default Navbar