import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PokemonForm from '../components/PokemonForm'

const PokemonDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: pokemon, isLoading, isError } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      if (!res.ok) throw new Error('Error al cargar el pokémon')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return res.json()
    },
  })

  if (isLoading) return (
    <div className="p-6 flex flex-col items-center gap-4 animate-pulse">
      <div className="bg-gray-300 w-40 h-40 rounded-full"></div>
      <div className="bg-gray-300 h-6 w-32 rounded"></div>
      <div className="bg-gray-300 h-4 w-48 rounded"></div>
    </div>
  )

  if (isError) return <p className="p-6">Error al cargar el pokémon</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        ← Volver
      </button>

      <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-40 h-40"
        />
        <h1 className="text-3xl font-bold capitalize">
          #{pokemon.id} {pokemon.name}
        </h1>

        <div className="flex gap-2">
          {pokemon.types.map((t) => (
            <span key={t.type.name} className="bg-gray-200 px-3 py-1 rounded capitalize">
              {t.type.name}
            </span>
          ))}
        </div>

        <div className="w-full">
          <h2 className="font-bold text-lg mb-2">Estadísticas</h2>
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="flex justify-between border-b py-1">
              <span className="capitalize">{s.stat.name}</span>
              <span className="font-bold">{s.base_stat}</span>
            </div>
          ))}
        </div>

        <div className="w-full">
          <h2 className="font-bold text-lg mb-2">Habilidades</h2>
          <div className="flex gap-2 flex-wrap">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className="bg-blue-100 px-3 py-1 rounded capitalize">
                {a.ability.name}
              </span>
            ))}
          </div>
        </div>

        {/* Formulario de reseña */}
        <PokemonForm pokemonName={pokemon.name} />
      </div>
    </div>
  )
}

export default PokemonDetail