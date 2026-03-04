import { useState } from 'react'
import PuzzleModal from './PuzzleModal'
import useUnlocked from '../../hooks/pokemon/useUnlocked'
import Toast from '../funcionespagina/Toast'

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

const PokemonCard = ({ pokemon, onClick }) => {
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [toast, setToast] = useState(null)
  const { user, unlocked, unlockPokemon } = useUnlocked()

  const isUnlocked = unlocked.some((p) => p.id === pokemon.id)
  const mainType = pokemon.types[0]?.type.name
  const typeColor = typeColors[mainType] || '#A8A878'

  const handleSolved = async () => {
    await unlockPokemon(pokemon)
    setTimeout(() => setShowPuzzle(false), 1500)
  }

  const handleUnlockClick = (e) => {
    e.stopPropagation()
    if (!user) {
      setToast({ message: 'SIN CUENTA TU PROGRESO NO SE GUARDARA', type: 'warning' })
      setTimeout(() => setShowPuzzle(true), 3000)
      return
    }
    if (!isUnlocked) setShowPuzzle(true)
  }

  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-col cursor-pointer hover:scale-105 transition-transform"
        style={{
          background: `linear-gradient(135deg, #cc0000 0%, #aa0000 40%, ${typeColor}33 100%)`,
          border: '4px solid #000',
          boxShadow: `4px 4px 0px #000, inset 0 0 20px rgba(0,0,0,0.3)`,
          fontFamily: "'Press Start 2P', cursive",
          minHeight: '180px',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-2 pt-2">
          <span style={{ fontSize: '7px', color: '#ffdd00' }}>
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span style={{ fontSize: '6px', color: '#ffdd00', backgroundColor: typeColor, padding: '2px 4px', border: '2px solid #000' }}>
            {typeTranslations[mainType] || mainType?.toUpperCase()}
          </span>
        </div>

        {/* Imagen */}
        <div className="flex justify-center items-center py-1"
          style={{ background: 'rgba(0,0,0,0.3)', margin: '4px', border: '3px solid #000' }}
        >
          {isUnlocked ? (
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-16 h-16 pixel-fade-in"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center relative">
              <img
                src={pokemon.sprites.front_default}
                alt="???"
                className="w-16 h-16"
                style={{ filter: 'brightness(0)', imageRendering: 'pixelated' }}
              />
              <span className="absolute text-white font-bold" style={{ fontSize: '24px' }}>?</span>
            </div>
          )}
        </div>

        {/* Nombre */}
        <div className="text-center px-1 py-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <p style={{ fontSize: '7px', color: isUnlocked ? '#fff' : '#555' }}>
            {isUnlocked ? pokemon.name.toUpperCase() : '???'}
          </p>
        </div>

        {/* Tipos */}
        <div className="flex gap-1 justify-center px-1 py-1">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              style={{
                fontSize: '5px',
                backgroundColor: isUnlocked ? (typeColors[t.type.name] || '#A8A878') : '#333',
                color: '#000',
                padding: '2px 4px',
                border: '2px solid #000',
              }}
            >
              {isUnlocked ? (typeTranslations[t.type.name] || t.type.name.toUpperCase()) : '???'}
            </span>
          ))}
        </div>

        {/* Boton o estado */}
        <div className="flex justify-center pb-2 mt-auto">
          {!isUnlocked ? (
            <button
              onClick={handleUnlockClick}
              className="hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: '#ffdd00',
                color: '#000',
                fontSize: '6px',
                padding: '3px 8px',
                border: '3px solid #000',
                boxShadow: '2px 2px 0 #000',
                fontFamily: "'Press Start 2P', cursive",
              }}
            >
              DESBLOQUEAR
            </button>
          ) : (
            <span style={{ fontSize: '6px', color: '#4ade80' }}>CAPTURADO</span>
          )}
        </div>
      </div>

      {showPuzzle && (
        <PuzzleModal
          pokemon={pokemon}
          onSolved={handleSolved}
          onClose={() => setShowPuzzle(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default PokemonCard