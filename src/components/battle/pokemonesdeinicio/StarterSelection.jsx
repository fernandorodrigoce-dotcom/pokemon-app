import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const STARTERS = [1, 4, 7]

const typeColors = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
}

const typeTranslations = {
  fire: 'FUEGO', water: 'AGUA', grass: 'PLANTA', electric: 'ELECTRICO',
  poison: 'VENENO', flying: 'VOLADOR', normal: 'NORMAL',
}

const starterThemes = {
  1: { bg: 'linear-gradient(160deg, #d4f5d4, #a8e6a8)', accent: '#2E7D32', glow: '#66BB6A', emoji: '🌿' },
  4: { bg: 'linear-gradient(160deg, #ffe8cc, #ffcc88)', accent: '#E65100', glow: '#FF8A65', emoji: '🔥' },
  7: { bg: 'linear-gradient(160deg, #cce8ff, #88ccff)', accent: '#0D47A1', glow: '#64B5F6', emoji: '💧' },
}

const StarterSelection = ({ onSelect }) => {
  const [selected, setSelected] = useState(null)

  const { data: starters, isLoading } = useQuery({
    queryKey: ['starters'],
    queryFn: async () => {
      const details = await Promise.all(
        STARTERS.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json())
        )
      )
      return details
    },
  })

  if (isLoading) return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(160deg, #87CEEB, #FFF9C4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#cc0000', fontSize: '12px' }}>CARGANDO...</p>
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#555', fontSize: '7px' }}>EL PROF. OAK ESTÁ LISTO</p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(160deg, #87CEEB 0%, #B0E8FF 35%, #FFFDE7 70%, #FFECB3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 40px 120px',
      fontFamily: "'Press Start 2P', cursive",
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Pasto inferior */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70px',
        background: 'repeating-linear-gradient(90deg, #4CAF50 0, #4CAF50 20px, #66BB6A 20px, #66BB6A 40px)',
        borderTop: '6px solid #2E7D32',
      }} />

      {/* Titulo */}
      <div style={{
        background: '#cc0000',
        border: '6px solid #000',
        boxShadow: '6px 6px 0 #000',
        padding: '20px 40px',
        marginBottom: '24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <p style={{ fontSize: '14px', color: '#FFD600', textShadow: '3px 3px 0 #000', marginBottom: '10px' }}>
          ¡ELIGE TU PRIMER POKÉMON!
        </p>
        <p style={{ fontSize: '7px', color: '#fff', textShadow: '1px 1px 0 #000' }}>
          — POKÉMON ROJO / AZUL —
        </p>
      </div>

      {/* Dialog Oak */}
      <div style={{
        background: '#fff',
        border: '4px solid #000',
        boxShadow: '4px 4px 0 #000',
        padding: '12px 24px',
        marginBottom: '32px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <p style={{ fontSize: '6px', color: '#cc0000', marginBottom: '5px' }}>PROF. OAK:</p>
        <p style={{ fontSize: '7px', color: '#222', lineHeight: '1.9' }}>
          ¡Hola! ¡Bienvenido al mundo POKÉMON!<br />
          Elige sabiamente... ¡te acompañará en toda la aventura!
        </p>
      </div>

      {/* Tarjetas */}
      <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px', zIndex: 1, width: '100%' }}>
        {starters?.map((pokemon) => {
          const isSelected = selected?.id === pokemon.id
          const theme = starterThemes[pokemon.id] || starterThemes[1]

          return (
            <div
              key={pokemon.id}
              onClick={() => setSelected(pokemon)}
              style={{
                background: isSelected ? 'linear-gradient(160deg, #fff9c4, #FFD600)' : theme.bg,
                border: isSelected ? '6px solid #FFD600' : '5px solid #000',
                boxShadow: isSelected ? `6px 6px 0 #000, 0 0 28px ${theme.glow}` : '5px 5px 0 #000',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                flex: '1',
                maxWidth: '260px',
                minWidth: '180px',
                transition: 'transform 0.12s',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '18px' }}>{theme.emoji}</span>

              <p style={{ fontSize: '7px', color: theme.accent, alignSelf: 'flex-start', opacity: 0.8 }}>
                #{String(pokemon.id).padStart(3, '0')}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.5)', border: `4px solid ${theme.accent}`, padding: '12px' }}>
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  style={{ width: '130px', height: '130px', imageRendering: 'pixelated', display: 'block' }}
                />
              </div>

              <p style={{ fontSize: '11px', color: isSelected ? '#000' : theme.accent }}>
                {pokemon.name.toUpperCase()}
              </p>

              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {pokemon.types.map((t) => (
                  <span key={t.type.name} style={{
                    fontSize: '6px',
                    background: typeColors[t.type.name] || '#A8A878',
                    color: '#fff',
                    padding: '3px 8px',
                    border: '2px solid rgba(0,0,0,0.3)',
                    textShadow: '1px 1px 0 rgba(0,0,0,0.4)',
                  }}>
                    {typeTranslations[t.type.name] || t.type.name.toUpperCase()}
                  </span>
                ))}
              </div>

              {isSelected && (
                <p style={{ fontSize: '7px', color: '#cc0000', background: '#fff', border: '2px solid #000', padding: '3px 10px', boxShadow: '2px 2px 0 #000' }}>
                  ▶ SELECCIONADO ◀
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Boton */}
      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '11px',
          color: !selected ? '#999' : '#000',
          background: !selected ? '#ddd' : '#FFD600',
          border: `5px solid ${!selected ? '#aaa' : '#000'}`,
          boxShadow: !selected ? 'none' : '6px 6px 0 #000',
          padding: '18px 48px',
          cursor: !selected ? 'not-allowed' : 'pointer',
          letterSpacing: '1px',
          zIndex: 1,
        }}
        onMouseDown={e => { if (selected) e.currentTarget.style.boxShadow = '2px 2px 0 #000' }}
        onMouseUp={e => { if (selected) e.currentTarget.style.boxShadow = '6px 6px 0 #000' }}
      >
        {selected ? `▶ ELEGIR A ${selected.name.toUpperCase()}` : '— ELIGE UN POKÉMON —'}
      </button>

    </div>
  )
}

export default StarterSelection