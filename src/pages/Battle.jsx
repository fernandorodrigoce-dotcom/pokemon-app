import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/autenticaciongoo/useAuth'
import useUnlocked from '../hooks/pokemon/useUnlocked'
import StarterSelection from "../components/battle/pokemonesdeinicio/StarterSelection"
import BattleRoom from '../components/battle/reutilizablepvp/BattleRoom'
import MoveSelector from '../components/battle/reutilizablepvp/MoveSelector'

const Battle = () => {
  const { user, loading, loginWithGoogle, logout } = useAuth()
  const { unlocked } = useUnlocked()
  const [starter, setStarter] = useState(null)
  const [loadingStarter, setLoadingStarter] = useState(false)
  const [myPokemon, setMyPokemon] = useState(null)
  const [rivalPokemon, setRivalPokemon] = useState(null)
  const [mySelectedMoves, setMySelectedMoves] = useState([])
  const [stage, setStage] = useState('menu')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const checkStarter = async () => {
      setLoadingStarter(true)
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) setStarter(docSnap.data().starter || null)
      setLoadingStarter(false)
    }
    checkStarter()
  }, [user])

  const handleSelectStarter = async (pokemon) => {
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    const existingUnlocked = docSnap.exists() ? (docSnap.data().unlocked || []) : []
    await setDoc(docRef, {
      starter: { id: pokemon.id, name: pokemon.name, sprite: pokemon.sprites.front_default },
      unlocked: existingUnlocked,
    })
    setStarter({ id: pokemon.id, name: pokemon.name, sprite: pokemon.sprites.front_default })
  }

  const loadFullPokemon = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    return res.json()
  }

  const startArcade = async () => {
    const my = await loadFullPokemon(starter.id)
    const rivalId = Math.floor(Math.random() * 151) + 1
    const rival = await loadFullPokemon(rivalId)
    setMyPokemon(my)
    setRivalPokemon(rival)
    setStage('selectMoves')
  }

  const handleMovesConfirmed = (moves) => {
    setMySelectedMoves(moves)
    setStage('battle')
  }

  const PixelBtn = ({ onClick, children, color = '#cc0000' }) => (
    <button
      onClick={onClick}
      style={{
        background: color,
        color: color === '#ffdd00' ? '#000' : '#fff',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '14px',
        padding: '18px 36px',
        border: '4px solid #000',
        boxShadow: '4px 4px 0 #000',
        cursor: 'pointer',
      }}
      onMouseDown={e => e.currentTarget.style.boxShadow = '1px 1px 0 #000'}
      onMouseUp={e => e.currentTarget.style.boxShadow = '4px 4px 0 #000'}
    >
      {children}
    </button>
  )

  if (loading || loadingStarter) return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#ffdd00', fontSize: '18px' }}>
        CARGANDO...
      </p>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#cc0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
      <div style={{ background: '#aa0000', border: '6px solid #000', boxShadow: '8px 8px 0 #000', width: '100%', maxWidth: '600px' }}>
        <div style={{ background: '#aa0000', borderBottom: '4px solid #000', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['#ff6666', '#ffdd00', '#66ff66'].map((c, i) => (
              <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '2px solid #000' }} />
            ))}
          </div>
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px', color: '#ffdd00' }}>BATALLA</p>
          <div style={{ width: '40px', height: '8px', background: '#1a1a2e', border: '2px solid #000' }} />
        </div>
        <div style={{ background: '#2a3a2a', margin: '16px', border: '4px solid #000', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#ffdd00', fontSize: '20px' }}>BATALLA</p>
          <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#4ade80', fontSize: '11px' }}>INICIA SESION PARA JUGAR</p>
          <PixelBtn onClick={loginWithGoogle} color='#ffdd00'>INICIAR CON GOOGLE</PixelBtn>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px', borderTop: '4px solid #000' }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ width: '28px', height: '10px', background: '#aa0000', border: '2px solid #000' }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (!starter && !loadingStarter && user) return <StarterSelection onSelect={handleSelectStarter} />

  if (stage === 'selectMoves' && myPokemon) return (
    <MoveSelector pokemon={myPokemon} onConfirm={handleMovesConfirmed} onCancel={() => setStage('menu')} />
  )

  if (stage === 'battle' && myPokemon && rivalPokemon) return (
    <BattleRoom myPokemon={myPokemon} rivalPokemon={rivalPokemon} mySelectedMoves={mySelectedMoves} onFinish={() => setStage('menu')} />
  )

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#cc0000', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#aa0000', borderBottom: '4px solid #000', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['#ff6666', '#ffdd00', '#66ff66'].map((c, i) => (
            <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '2px solid #000' }} />
          ))}
        </div>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '16px', color: '#ffdd00' }}>BATALLA</p>
        <div style={{ width: '40px', height: '8px', background: '#1a1a2e', border: '2px solid #000' }} />
      </div>

      {/* Pantalla */}
      <div style={{ background: '#2a3a2a', margin: '16px', border: '4px solid #000', padding: '24px', flex: 1, overflowY: 'auto' }}>

        {/* Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.3)', border: '3px solid #000', padding: '16px', marginBottom: '24px' }}>
          <img src={user.photoURL} alt={user.displayName} style={{ width: '80px', height: '80px', border: '4px solid #ffdd00', imageRendering: 'pixelated' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px', color: '#ffdd00' }}>
              {user.displayName.toUpperCase().slice(0, 14)}
            </p>
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#4ade80', marginTop: '8px' }}>★ ENTRENADOR</p>
          </div>
          <button onClick={logout} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#fff', background: '#cc0000', border: '2px solid #000', padding: '8px 14px', cursor: 'pointer' }}>
            SALIR
          </button>
        </div>

        {/* Starter */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '3px solid #ffdd00', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#ffdd00', marginBottom: '16px' }}>★ POKEMON INICIAL ★</p>
          <img src={starter.sprite} alt={starter.name} style={{ width: '180px', height: '180px', imageRendering: 'pixelated' }} />
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '16px', color: '#fff', marginTop: '12px' }}>
            {starter.name.toUpperCase()}
          </p>
        </div>

        {/* Capturados */}
        <div>
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#ffdd00', marginBottom: '14px' }}>
            CAPTURADOS ({unlocked.length})
          </p>
          {unlocked.length === 0 ? (
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#555', textAlign: 'center', padding: '16px' }}>
              NINGUNO AUN...
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {unlocked.map((p) => (
                <div key={p.id} style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #444', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <img src={p.sprite} alt={p.name} style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }} />
                  <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: '#ccc', textAlign: 'center' }}>
                    {p.name.toUpperCase().slice(0, 8)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botones modos */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '20px', borderTop: '4px solid #000', background: '#aa0000' }}>
        <PixelBtn onClick={() => navigate('/pvp')} color='#cc0000'>PVP ONLINE</PixelBtn>
        <PixelBtn onClick={startArcade} color='#ffdd00'>ARCADE</PixelBtn>
      </div>

      {/* Decorativos */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingBottom: '20px', background: '#aa0000' }}>
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ width: '28px', height: '10px', background: '#880000', border: '2px solid #000' }} />
        ))}
      </div>

    </div>
  )
}

export default Battle