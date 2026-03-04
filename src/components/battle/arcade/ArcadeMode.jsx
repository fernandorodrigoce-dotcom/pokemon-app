import useBattle from '../../../hooks/batalla/useBattle'

const font = "'Press Start 2P', cursive"

const HPBar = ({ current, max }) => {
  const percent = Math.max(0, (current / max) * 100)
  const color = percent > 50 ? '#4ade80' : percent > 20 ? '#ffdd00' : '#cc0000'
  return (
    <div style={{ width: '100%', background: '#333', border: '2px solid #000', height: '12px' }}>
      <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 0.5s ease' }} />
    </div>
  )
}

const ArcadeMode = ({ myPokemon, rivalPokemon, mySelectedMoves, onFinish }) => {
  const {
    myHP, rivalHP, myMaxHP, rivalMaxHP,
    myMoves, log, isMyTurn, battleOver, winner, loading, attack
  } = useBattle(myPokemon, rivalPokemon, mySelectedMoves)

  if (loading) return (
    <p style={{ fontFamily: font, color: '#ffdd00', fontSize: '12px' }}>CARGANDO BATALLA...</p>
  )

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Pokemons */}
      <div style={{ background: 'rgba(0,0,0,0.3)', border: '4px solid #000', padding: '16px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        {/* Rival */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontFamily: font, fontSize: '7px', color: '#ff6666' }}>RIVAL</p>
          <img src={rivalPokemon.sprites.front_default} alt={rivalPokemon.name}
            style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} />
          <p style={{ fontFamily: font, fontSize: '8px', color: '#fff' }}>{rivalPokemon.name.toUpperCase()}</p>
          <p style={{ fontFamily: font, fontSize: '7px', color: '#aaa' }}>{rivalHP} / {rivalMaxHP}</p>
          <HPBar current={rivalHP} max={rivalMaxHP} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: font, fontSize: '14px', color: '#ffdd00' }}>VS</p>
        </div>

        {/* Yo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontFamily: font, fontSize: '7px', color: '#4ade80' }}>TU</p>
          <img src={myPokemon.sprites.back_default || myPokemon.sprites.front_default} alt={myPokemon.name}
            style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} />
          <p style={{ fontFamily: font, fontSize: '8px', color: '#fff' }}>{myPokemon.name.toUpperCase()}</p>
          <p style={{ fontFamily: font, fontSize: '7px', color: '#aaa' }}>{myHP} / {myMaxHP}</p>
          <HPBar current={myHP} max={myMaxHP} />
        </div>
      </div>

      {/* Resultado */}
      {battleOver && (
        <div style={{ background: '#1a1a2e', border: '4px solid #ffdd00', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontFamily: font, fontSize: '14px', color: '#ffdd00' }}>
            {winner === 'me' ? 'GANASTE' : 'PERDISTE'}
          </p>
          <button
            onClick={onFinish}
            style={{ fontFamily: font, fontSize: '9px', color: '#000', background: '#ffdd00', border: '4px solid #000', boxShadow: '4px 4px 0 #000', padding: '12px 24px', cursor: 'pointer' }}
            onMouseDown={e => e.currentTarget.style.boxShadow = '1px 1px 0 #000'}
            onMouseUp={e => e.currentTarget.style.boxShadow = '4px 4px 0 #000'}
          >
            VOLVER
          </button>
        </div>
      )}

      {/* Movimientos */}
      {!battleOver && (
        <div>
          <p style={{ fontFamily: font, fontSize: '7px', color: isMyTurn ? '#ffdd00' : '#aaa', marginBottom: '10px', textAlign: 'center' }}>
            {isMyTurn ? 'ELIGE UN MOVIMIENTO' : 'TURNO DEL RIVAL...'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {myMoves.map((move) => (
              <button
                key={move.id}
                onClick={() => attack(move)}
                disabled={!isMyTurn}
                style={{
                  fontFamily: font, fontSize: '7px',
                  color: isMyTurn ? '#000' : '#555',
                  background: isMyTurn ? '#ffdd00' : '#333',
                  border: '3px solid #000',
                  boxShadow: isMyTurn ? '3px 3px 0 #000' : 'none',
                  padding: '10px 8px', cursor: isMyTurn ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                }}
                onMouseDown={e => { if (isMyTurn) e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
                onMouseUp={e => { if (isMyTurn) e.currentTarget.style.boxShadow = '3px 3px 0 #000' }}
              >
                <p>{move.name.toUpperCase()}</p>
                <p style={{ color: isMyTurn ? '#333' : '#444', marginTop: '4px', fontSize: '6px' }}>
                  PWR {move.power} | ACC {move.accuracy}%
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Log */}
      <div style={{ background: '#1a1a2e', border: '4px solid #000', padding: '10px', height: '100px', overflowY: 'auto' }}>
        {log.map((msg, i) => (
          <p key={i} style={{ fontFamily: font, fontSize: '10px', color: '#4ade80', marginBottom: '4px' }}>{msg}</p>
        ))}
      </div>

    </div>
  )
}

export default ArcadeMode