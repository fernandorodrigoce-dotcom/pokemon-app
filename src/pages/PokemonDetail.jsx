import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PokemonForm from '../components/pokemon/PokemonForm'
import Toast from '../components/funcionespagina/Toast'

const typeColors = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
}

const typeTranslations = {
  fire: 'FUEGO', water: 'AGUA', grass: 'PLANTA', electric: 'ELECTRICO',
  psychic: 'PSIQUICO', ice: 'HIELO', dragon: 'DRAGON', dark: 'SINIESTRO',
  fairy: 'HADA', normal: 'NORMAL', fighting: 'LUCHA', flying: 'VOLADOR',
  poison: 'VENENO', ground: 'TIERRA', rock: 'ROCA', bug: 'BICHO',
  ghost: 'FANTASMA', steel: 'ACERO',
}

const statTranslations = {
  'hp': 'HP', 'attack': 'ATAQUE', 'defense': 'DEFENSA',
  'special-attack': 'AT.ESP', 'special-defense': 'DEF.ESP', 'speed': 'VEL',
}

const StatBar = ({ name, value }) => {
  const percent = Math.min((value / 255) * 100, 100)
  const color = value >= 100 ? '#2d8a2d' : value >= 60 ? '#b8860b' : '#cc0000'
  return (
    <div className="flex items-center gap-2 mb-2">
      <span style={{ fontSize: '6px', color: '#333', width: '65px', fontFamily: "'Press Start 2P', cursive" }}>
        {statTranslations[name] || name.toUpperCase()}
      </span>
      <span style={{ fontSize: '6px', color: '#333', width: '25px', fontFamily: "'Press Start 2P', cursive" }}>
        {value}
      </span>
      <div style={{ flex: 1, height: '8px', background: '#ccc', border: '2px solid #000' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

const PokemonDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  const { data: pokemon, isLoading, isError } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      if (!res.ok) throw new Error('Error')
      return res.json()
    },
  })

  const { data: evolutionChain } = useQuery({
    queryKey: ['evolution', id],
    queryFn: async () => {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      const species = await speciesRes.json()
      const evoRes = await fetch(species.evolution_chain.url)
      const evoData = await evoRes.json()
      const chain = []
      let current = evoData.chain
      while (current) {
        const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${current.species.name}`)
        const pokeData = await pokeRes.json()
        chain.push({
          name: current.species.name,
          id: pokeData.id,
          sprite: pokeData.sprites.front_default,
        })
        current = current.evolves_to[0]
      }
      return chain
    },
    enabled: !!pokemon,
  })

  const mainType = pokemon?.types[0]?.type.name
  const typeColor = typeColors[mainType] || '#A8A878'

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-green-400 text-xs blink" style={{ fontFamily: "'Press Start 2P', cursive" }}>
        CARGANDO...
      </p>
    </div>
  )

  if (isError) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-red-500 text-xs" style={{ fontFamily: "'Press Start 2P', cursive" }}>ERROR</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-4">

      {/* Toast fuera de la carta */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Boton volver */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 hover:opacity-80 transition-opacity"
        style={{
          background: '#cc0000',
          color: '#fff',
          fontSize: '8px',
          padding: '8px 16px',
          border: '4px solid #000',
          boxShadow: '3px 3px 0 #000',
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        &lt; VOLVER
      </button>

      {/* Carta */}
      <div
        className="max-w-sm mx-auto pixel-fade-in"
        style={{
          background: 'linear-gradient(160deg, #f5d76e 0%, #f0c040 50%, #e8b820 100%)',
          border: '6px solid #000',
          boxShadow: '8px 8px 0 #000',
          borderRadius: '4px',
        }}
      >
        {/* Header */}
        <div style={{
          background: typeColor,
          borderBottom: '4px solid #000',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '9px', color: '#000', fontFamily: "'Press Start 2P', cursive" }}>
            #{String(pokemon.id).padStart(3, '0')} {pokemon.name.toUpperCase()}
          </span>
          <div className="flex gap-1">
            {pokemon.types.map((t) => (
              <span key={t.type.name} style={{
                fontSize: '6px',
                backgroundColor: '#000',
                color: typeColors[t.type.name] || '#fff',
                padding: '2px 5px',
                fontFamily: "'Press Start 2P', cursive",
              }}>
                {typeTranslations[t.type.name] || t.type.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Imagen */}
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          border: '4px solid #000',
          margin: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2)',
        }}>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            style={{ width: '160px', height: '160px', imageRendering: 'pixelated' }}
          />
        </div>

        {/* Medidas */}
        <div style={{ padding: '0 12px 8px', display: 'flex', justifyContent: 'space-around' }}>
          <span style={{ fontSize: '7px', color: '#333', fontFamily: "'Press Start 2P', cursive" }}>
            ALT: {(pokemon.height / 10).toFixed(1)}m
          </span>
          <span style={{ fontSize: '7px', color: '#333', fontFamily: "'Press Start 2P', cursive" }}>
            PESO: {(pokemon.weight / 10).toFixed(1)}kg
          </span>
        </div>

        {/* Habilidades */}
        <div style={{ padding: '8px 12px', borderTop: '3px solid #000', borderBottom: '3px solid #000', background: 'rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '7px', color: '#333', marginBottom: '6px', fontFamily: "'Press Start 2P', cursive" }}>
            HABILIDADES
          </p>
          <div className="flex gap-2 flex-wrap">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} style={{
                fontSize: '6px',
                backgroundColor: typeColor,
                color: '#000',
                padding: '3px 6px',
                border: '2px solid #000',
                boxShadow: '2px 2px 0 #000',
                fontFamily: "'Press Start 2P', cursive",
              }}>
                {a.ability.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '8px 12px', borderBottom: '3px solid #000' }}>
          <p style={{ fontSize: '7px', color: '#333', marginBottom: '8px', fontFamily: "'Press Start 2P', cursive" }}>
            ESTADISTICAS
          </p>
          {pokemon.stats.map((s) => (
            <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
          ))}
        </div>

        {/* Evoluciones */}
        {evolutionChain && evolutionChain.length > 1 && (
          <div style={{ padding: '8px 12px', borderBottom: '3px solid #000' }}>
            <p style={{ fontSize: '7px', color: '#333', marginBottom: '8px', fontFamily: "'Press Start 2P', cursive" }}>
              EVOLUCIONES
            </p>
            <div className="flex justify-around items-center">
              {evolutionChain.map((evo, i) => (
                <div key={evo.id} className="flex items-center gap-1">
                  <div
                    className="flex flex-col items-center cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/pokemon/${evo.id}`)}
                  >
                    <img
                      src={evo.sprite}
                      alt={evo.name}
                      style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                    />
                    <span style={{ fontSize: '5px', color: '#333', fontFamily: "'Press Start 2P', cursive" }}>
                      {evo.name.toUpperCase()}
                    </span>
                  </div>
                  {i < evolutionChain.length - 1 && (
                    <span style={{ fontSize: '10px', color: '#333', margin: '0 4px' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resena */}
        <div style={{ padding: '8px 12px' }}>
          <p style={{ fontSize: '7px', color: '#333', marginBottom: '8px', fontFamily: "'Press Start 2P', cursive" }}>
            RESENA
          </p>
          <PokemonForm
            pokemonName={pokemon.name}
            onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
          />
        </div>

      </div>
    </div>
  )
}

export default PokemonDetail