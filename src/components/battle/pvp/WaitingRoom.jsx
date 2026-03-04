const WaitingRoom = ({ roomId, roomData, myKey, rivalKey, onLeave }) => {
  const me = roomData?.[myKey]
  const rival = roomData?.[rivalKey]

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>

      {/* Codigo de sala */}
      <div style={{ background: 'rgba(0,0,0,0.3)', border: '3px solid #ffdd00', padding: '20px 40px', textAlign: 'center', width: '100%' }}>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#aaa', marginBottom: '12px' }}>CODIGO DE SALA</p>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '32px', color: '#ffdd00', letterSpacing: '12px' }}>{roomId}</p>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: '#555', marginTop: '12px' }}>COMPARTE ESTE CODIGO</p>
      </div>

      {/* VS */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>

        {/* Yo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.3)', border: '3px solid #444', padding: '20px' }}>
          <img src={me?.photo} alt={me?.name}
            style={{ width: '100px', height: '100px', border: '4px solid #ffdd00', imageRendering: 'pixelated' }} />
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#fff' }}>
            {me?.name?.toUpperCase().slice(0, 8)}
          </p>
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', background: '#4ade80', color: '#000', padding: '4px 10px', border: '2px solid #000' }}>TU</span>
        </div>

        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '28px', color: '#ffdd00' }}>VS</p>

        {/* Rival */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.3)', border: '3px solid #444', padding: '20px' }}>
          {rival ? (
            <>
              <img src={rival.photo} alt={rival.name}
                style={{ width: '100px', height: '100px', border: '4px solid #4444cc', imageRendering: 'pixelated' }} />
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#fff' }}>
                {rival.name?.toUpperCase().slice(0, 8)}
              </p>
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', background: '#6666ff', color: '#fff', padding: '4px 10px', border: '2px solid #000' }}>RIVAL</span>
            </>
          ) : (
            <>
              <div style={{ width: '100px', height: '100px', border: '4px solid #444', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '32px', color: '#555' }}>?</p>
              </div>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#aaa' }}>ESPERANDO...</p>
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', background: '#444', color: '#aaa', padding: '4px 10px', border: '2px solid #000' }}>???</span>
            </>
          )}
        </div>
      </div>

      {rival && (
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#4ade80', textAlign: 'center' }}>
          ★ RIVAL ENCONTRADO! ELIGE TUS POKEMONS ★
        </p>
      )}

      <button
        onClick={onLeave}
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '14px', color: '#fff', background: '#cc0000',
          border: '4px solid #000', boxShadow: '4px 4px 0 #000',
          padding: '18px 36px', cursor: 'pointer',
        }}
        onMouseDown={e => e.currentTarget.style.boxShadow = '1px 1px 0 #000'}
        onMouseUp={e => e.currentTarget.style.boxShadow = '4px 4px 0 #000'}
      >
        ABANDONAR SALA
      </button>

    </div>
  )
}

export default WaitingRoom