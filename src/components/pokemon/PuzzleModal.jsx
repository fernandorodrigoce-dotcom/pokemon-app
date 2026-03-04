import SlidingPuzzle from './SlidingPuzzle'

const PuzzleModal = ({ pokemon, onSolved, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '6px solid #000',
        boxShadow: '8px 8px 0 #000',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '360px',
        width: '100%',
      }}>

        {/* Header */}
        <div style={{
          background: '#cc0000',
          border: '4px solid #000',
          padding: '10px 20px',
          width: '100%',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#ffdd00' }}>
            DESBLOQUEAR
          </p>
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#fff', marginTop: '6px' }}>
            {pokemon.name.toUpperCase()}
          </p>
        </div>

        {/* Puzzle */}
        <SlidingPuzzle
          imageUrl={pokemon.sprites.other['official-artwork'].front_default}
          onSolved={onSolved}
        />

        {/* Boton cancelar */}
        <button
          onClick={onClose}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '7px',
            color: '#fff',
            background: '#444',
            border: '3px solid #000',
            boxShadow: '3px 3px 0 #000',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          CANCELAR
        </button>
      </div>
    </div>
  )
}

export default PuzzleModal