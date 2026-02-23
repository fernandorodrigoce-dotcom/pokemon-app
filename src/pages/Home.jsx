import { useState } from 'react'
import usePokemon from '../hooks/usePokemon'
import PokemonCard from '../components/PokemonCard'
import SkeletonCard from '../components/SkeletonCard'

const Home = () => {
  const { data: pokemons, isLoading, isError } = usePokemon()
  const [search, setSearch] = useState('')

  // Filtrar por nombre
  const filtered = pokemons?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (isError) return <p className="p-4">Error al cargar los pokémons</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full max-w-sm mb-6"
      />

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? // Mostrar 12 skeletons mientras carga
            Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
      </div>
    </div>
  )
}

export default Home