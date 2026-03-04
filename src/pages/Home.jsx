import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePokemon, { useSearchPokemon } from '../hooks/pokemon/usePokemon'
import PokemonCard from '../components/pokemon/PokemonCard'
import SkeletonCard from '../components/funcionespagina/SkeletonCard'
import Pagination from '../components/funcionespagina/Pagination'
import useUnlocked from '../hooks/pokemon/useUnlocked'

const playPokedexSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'square'
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.1)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.15)
    })
  } catch(e) {}
}

const Home = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(() => Number(sessionStorage.getItem('pokedexPage')) || 1)
  const [powered, setPowered] = useState(false)
  const [booting, setBooting] = useState(() => sessionStorage.getItem('pokedexStarted') !== 'true')
  const [started, setStarted] = useState(() => sessionStorage.getItem('pokedexStarted') === 'true')
  const { data, isLoading } = usePokemon(page)
  const { data: searchResults, isLoading: isSearching } = useSearchPokemon(search)
  const { unlocked } = useUnlocked()
  const navigate = useNavigate()

  const filtered = search ? searchResults : data?.pokemons
  const loadingState = search ? isSearching : isLoading

  const handleStart = () => {
    sessionStorage.setItem('pokedexStarted', 'true')
    setStarted(true)
    setPowered(false)
    setBooting(true)
    setTimeout(() => {
      playPokedexSound()
      setPowered(true)
      setTimeout(() => setBooting(false), 1500)
    }, 500)
  }

  if (!started) return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 cursor-pointer"
      onClick={handleStart}
    >
      <div className="text-red-500 text-xl pixel-border p-8 bg-gray-900 text-center">
        <p className="mb-6">POKEDEX</p>
        <p className="text-green-400 text-xs blink">PRESIONA PARA INICIAR</p>
      </div>
    </div>
  )

  if (booting) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className={`flex flex-col items-center gap-6 ${powered ? 'power-on' : 'opacity-0'}`}>
        <div className="text-red-500 text-2xl pixel-border p-6 bg-gray-900">
          <p className="blink">POKEDEX</p>
        </div>
        <p className="text-green-400 text-xs">INICIANDO...</p>
        <div className="flex gap-2">
          {[0,1,2].map((i) => (
            <div key={i} className="w-3 h-3 bg-red-500 pixel-border" style={{
              animation: `blink 0.5s infinite ${i * 0.2}s`
            }}/>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 pixel-fade-in">

      {/* Header */}
      <div className="bg-red-600 pixel-border-red p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-300 pixel-border blink" />
          <div className="flex gap-1">
            {['bg-red-300', 'bg-yellow-300', 'bg-green-300'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${c} pixel-border`} />
            ))}
          </div>
        </div>
        <h1 className="text-white text-sm">POKEDEX</h1>
        <div className="w-16 h-4 bg-gray-800 pixel-border" />
      </div>

      {/* Pantalla */}
      <div className="bg-gray-800 mx-4 mt-4 pixel-border p-4">

        {/* Buscador */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="BUSCAR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-green-900 text-green-400 border-4 border-black px-4 py-2 text-xs outline-none placeholder-green-700"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-2 text-green-400 text-xs"
            >
              X
            </button>
          )}
        </div>

        {/* Info */}
        {!search && (
          <p className="text-green-400 text-xs mb-4">
            PAG {page}/{data?.totalPages} — {data?.total} POKEMONS
          </p>
        )}
        {search && !isSearching && (
          <p className="text-green-400 text-xs mb-4">
            {filtered?.length || 0} RESULTADOS: "{search.toUpperCase()}"
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {loadingState
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered?.filter(Boolean).map((pokemon) => {
                const isUnlocked = unlocked.some((p) => p.id === pokemon.id)
                return (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isUnlocked={isUnlocked}
                    onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                  />
                )
              })}
        </div>

        {/* Paginacion */}
        {!loadingState && !search && (
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages}
            onNext={() => { const n = page + 1; sessionStorage.setItem('pokedexPage', n); setPage(n) }}
            onPrev={() => { const p = page - 1; sessionStorage.setItem('pokedexPage', p); setPage(p) }}
          />
        )}
      </div>

      {/* Botones decorativos */}
      <div className="flex justify-center gap-4 p-4 mt-2">
        <div className="w-16 h-6 bg-gray-600 pixel-border" />
        <div className="w-8 h-8 rounded-full bg-red-500 pixel-border" />
        <div className="w-16 h-6 bg-gray-600 pixel-border" />
      </div>
    </div>
  )
}

export default Home