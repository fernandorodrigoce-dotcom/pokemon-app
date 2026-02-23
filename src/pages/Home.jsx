import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePokemon from '../hooks/usePokemon'
import PokemonCard from '../components/PokemonCard'
import SkeletonCard from '../components/SkeletonCard'
import Pagination from '../components/Pagination'

const Home = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = usePokemon(page)
  console.log('data:', data)
  const navigate = useNavigate()

  const filtered = data?.pokemons?.filter((p) =>
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
          ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered?.filter(Boolean).map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => navigate(`/pokemon/${pokemon.id}`)}
              />
            ))}
      </div>

      {/* Paginacion */}
      {!isLoading && !search && (
        <Pagination
          currentPage={page}
          totalPages={data?.totalPages}
          onNext={() => setPage((p) => p + 1)}
          onPrev={() => setPage((p) => p - 1)}
        />
      )}
    </div>
  )
}

export default Home