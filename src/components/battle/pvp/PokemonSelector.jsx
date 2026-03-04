import { useState } from 'react'

const font = "'Press Start 2P', cursive"

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
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
    onMouseUp={e => { if (!disabled) e.currentTarget.style.boxShadow = '4px 4px 0 #000' }}
  >
    {children}
  </button>
)

const PokemonSelector = ({ collection, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState([])

  const toggle = (pokemon) => {
    if (selected.find((p) => p.id === pokemon.id)) {
      setSelected((prev) => prev.filter((p) => p.id !== pokemon.id))
    } else {
      if (selected.length >= 3) return
      setSelected((prev) => [...prev, pokemon])
    }
  }

  if (collection.length < 3) return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #ff6666', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontFamily: font, fontSize: '11px', color: '#ffdd00' }}>POKEMONS INSUFICIENTES</p>
        <p style={{ fontFamily: font, fontSize: '8px', color: '#aaa', lineHeight: '2.2' }}>
          NECESITAS AL MENOS 3 POKEMONS.<br />
          TIENES {collection.length}. VE A INICIO<br />
          Y DESBLOQUEA MAS.
        </p>
      </div>
      <PixelBtn onClick={onCancel} color='#cc0000'>IR A INICIO</PixelBtn>
    </div>
  )

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

      <div style={{
        background: selected.length === 3 ? 'rgba(74,222,128,0.2)' : 'rgba(0,0,0,0.3)',
        border: selected.length === 3 ? '3px solid #4ade80' : '3px solid #444',
        padding: '12px 28px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: font, fontSize: '9px', color: selected.length === 3 ? '#4ade80' : '#ffdd00' }}>
          {selected.length === 3 ? '★ EQUIPO COMPLETO ★' : `SELECCIONADOS: ${selected.length} / 3`}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        width: '100%',
      }}>
        {collection.map((pokemon) => {
          const isSelected = !!selected.find((p) => p.id === pokemon.id)
          const isDisabled = selected.length >= 3 && !isSelected
          return (
            <div
              key={pokemon.id}
              onClick={() => !isDisabled && toggle(pokemon)}
              style={{
                background: isSelected ? 'rgba(255,221,0,0.15)' : 'rgba(0,0,0,0.4)',
                border: isSelected ? '3px solid #ffdd00' : '3px solid #444',
                boxShadow: '4px 4px 0 #000',
                padding: '12px 6px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.35 : 1,
                position: 'relative',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  background: '#ffdd00', border: '3px solid #000',
                  width: '22px', height: '22px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: font, fontSize: '9px', color: '#000',
                  boxShadow: '2px 2px 0 #000',
                }}>
                  ✓
                </div>
              )}
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
              />
              <p style={{ fontFamily: font, fontSize: '6px', color: isSelected ? '#ffdd00' : '#ccc', textTransform: 'capitalize', textAlign: 'center' }}>
                {pokemon?.name || ''}
              </p>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '8px' }}>
        <PixelBtn onClick={onCancel} color='#444'>CANCELAR</PixelBtn>
        <PixelBtn
          onClick={() => selected.length === 3 && onConfirm(selected)}
          disabled={selected.length < 3}
          color='#ffdd00'
        >
          {selected.length < 3 ? `ELIGE ${3 - selected.length} MAS` : 'CONFIRMAR EQUIPO'}
        </PixelBtn>
      </div>

    </div>
  )
}

export default PokemonSelector