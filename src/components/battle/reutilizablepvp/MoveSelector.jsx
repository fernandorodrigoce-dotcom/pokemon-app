import { useState, useEffect } from 'react'

const font = "'Press Start 2P', cursive"

const typeColors = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
}

const fetchAllMoves = async (pokemon) => {
  const movesWithUrl = pokemon.moves.slice(0, 40).map((m) => m.move.url)
  const moveDetails = await Promise.all(
    movesWithUrl.map((url) => fetch(url).then((r) => r.json()))
  )
  return moveDetails.filter((m) => m.power)
}

const PixelBtn = ({ onClick, disabled, color = '#cc0000', children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      fontFamily: font, fontSize: '14px',
      background: disabled ? '#444' : color,
      color: color === '#ffdd00' ? '#000' : '#fff',
      border: '4px solid #000',
      boxShadow: disabled ? 'none' : '4px 4px 0 #000',
      padding: '18px 36px', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: '100%',
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
    onMouseUp={e => { if (!disabled) e.currentTarget.style.boxShadow = '4px 4px 0 #000' }}
  >
    {children}
  </button>
)

const MoveSelector = ({ pokemon, onConfirm, onCancel }) => {
  const [allMoves, setAllMoves] = useState([])
  const [selectedMoves, setSelectedMoves] = useState([])
  const [loading, setLoading] = useState(true)
  const [notEnoughMoves, setNotEnoughMoves] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const moves = await fetchAllMoves(pokemon)
      if (moves.length < 4) setNotEnoughMoves(true)
      setAllMoves(moves)
      setLoading(false)
    }
    load()
  }, [pokemon])

  const toggleMove = (move) => {
    if (selectedMoves.find((m) => m.id === move.id)) {
      setSelectedMoves((prev) => prev.filter((m) => m.id !== move.id))
    } else {
      if (selectedMoves.length >= 4) return
      setSelectedMoves((prev) => [...prev, move])
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: font, color: '#ffdd00', fontSize: '18px' }}>CARGANDO...</p>
    </div>
  )

  if (notEnoughMoves) return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #ff6666', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '120px', height: '120px', imageRendering: 'pixelated' }} />
        <p style={{ fontFamily: font, fontSize: '9px', color: '#ffdd00', textAlign: 'center', lineHeight: 2 }}>
          {pokemon.name.toUpperCase()} NO TIENE SUFICIENTES MOVIMIENTOS
        </p>
      </div>
      <PixelBtn onClick={onCancel} color='#cc0000'>VOLVER</PixelBtn>
    </div>
  )

  return (
    <div style={{ width: '100%', display: 'flex', gap: '24px' }}>

      {/* Panel izquierdo */}
      <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #ffdd00', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <img src={pokemon.sprites.front_default} alt={pokemon.name}
            style={{ width: '160px', height: '160px', imageRendering: 'pixelated' }} />
          <p style={{ fontFamily: font, fontSize: '11px', color: '#fff' }}>
            {pokemon.name.toUpperCase()}
          </p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #444', padding: '16px' }}>
          <p style={{ fontFamily: font, fontSize: '8px', color: '#ffdd00', marginBottom: '12px' }}>
            ELEGIDOS ({selectedMoves.length}/4)
          </p>
          {[0,1,2,3].map((i) => (
            <div key={i} style={{
              background: selectedMoves[i] ? typeColors[selectedMoves[i].type.name] || '#A8A878' : '#1a1a2e',
              border: '2px solid #000', padding: '10px 12px', marginBottom: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '36px',
            }}>
              {selectedMoves[i] ? (
                <>
                  <p style={{ fontFamily: font, fontSize: '7px', color: '#000' }}>
                    {selectedMoves[i].name.toUpperCase().slice(0, 12)}
                  </p>
                  <p style={{ fontFamily: font, fontSize: '7px', color: '#000' }}>{selectedMoves[i].power}</p>
                </>
              ) : (
                <p style={{ fontFamily: font, fontSize: '7px', color: '#333' }}>---</p>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PixelBtn
            onClick={() => {
              if (selectedMoves.length !== 4 || confirming) return
              setConfirming(true)
              onConfirm(selectedMoves)
            }}
            disabled={selectedMoves.length < 4 || confirming}
            color='#ffdd00'
          >
            {confirming ? 'CARGANDO...' : selectedMoves.length < 4 ? 'ELIGE ' + (4 - selectedMoves.length) + ' MAS' : 'CONFIRMAR'}
          </PixelBtn>
          <PixelBtn onClick={onCancel} color='#444'>CANCELAR</PixelBtn>
        </div>
      </div>

      {/* Panel derecho con scroll */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontFamily: font, fontSize: '8px', color: '#aaa' }}>
          MOVIMIENTOS DISPONIBLES ({allMoves.length})
        </p>
        <div style={{ height: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {allMoves.map((move) => {
            const isSelected = selectedMoves.find((m) => m.id === move.id)
            const moveColor = typeColors[move.type.name] || '#A8A878'
            return (
              <div
                key={move.id}
                onClick={() => toggleMove(move)}
                style={{
                  background: isSelected ? moveColor : 'rgba(0,0,0,0.4)',
                  border: isSelected ? '3px solid #ffdd00' : '3px solid #333',
                  padding: '12px 16px',
                  cursor: selectedMoves.length >= 4 && !isSelected ? 'not-allowed' : 'pointer',
                  opacity: selectedMoves.length >= 4 && !isSelected ? 0.4 : 1,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontFamily: font, fontSize: '8px', color: isSelected ? '#000' : '#fff' }}>
                    {move.name.toUpperCase()}
                  </p>
                  <p style={{ fontFamily: font, fontSize: '6px', color: isSelected ? '#000' : '#aaa', marginTop: '4px' }}>
                    {move.type.name.toUpperCase()} | {move.damage_class.name.toUpperCase()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: font, fontSize: '8px', color: isSelected ? '#000' : '#ffdd00' }}>
                    PWR {move.power}
                  </p>
                  <p style={{ fontFamily: font, fontSize: '6px', color: isSelected ? '#000' : '#aaa', marginTop: '4px' }}>
                    ACC {move.accuracy}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default MoveSelector