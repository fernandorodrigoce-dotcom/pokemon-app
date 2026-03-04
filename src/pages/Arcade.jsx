import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/autenticaciongoo/useAuth'
import MoveSelector from '../components/battle/reutilizablepvp/MoveSelector'
import ArcadeMode from '../components/battle/arcade/ArcadeMode'

const font = "'Press Start 2P', cursive"

const PixelBtn = ({ onClick, children, color = '#cc0000', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? '#444' : color,
      color: color === '#ffdd00' ? '#000' : '#fff',
      fontFamily: font,
      fontSize: '14px',
      padding: '18px 36px',
      border: '4px solid #000',
      boxShadow: disabled ? 'none' : '4px 4px 0 #000',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.boxShadow = '1px 1px 0 #000' }}
    onMouseUp={e => { if (!disabled) e.currentTarget.style.boxShadow = '4px 4px 0 #000' }}
  >
    {children}
  </button>
)

const Header = ({ title }) => (
  <div style={{ background: '#aa0000', borderBottom: '4px solid #000', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', gap: '10px' }}>
      {['#ff6666', '#ffdd00', '#66ff66'].map((c, i) => (
        <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '2px solid #000' }} />
      ))}
    </div>
    <p style={{ fontFamily: font, fontSize: '16px', color: '#ffdd00' }}>{title}</p>
    <div style={{ width: '40px', height: '8px', background: '#1a1a2e', border: '2px solid #000' }} />
  </div>
)

const Deco = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingBottom: '20px', paddingTop: '16px', background: '#aa0000', borderTop: '4px solid #000' }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={{ width: '28px', height: '10px', background: '#880000', border: '2px solid #000' }} />
    ))}
  </div>
)

const Shell = ({ title, children, footer }) => (
  <div style={{ minHeight: '100vh', width: '100%', background: '#cc0000', display: 'flex', flexDirection: 'column' }}>
    <Header title={title} />
    <div style={{ background: '#2a3a2a', margin: '16px', border: '4px solid #000', padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
      {children}
    </div>
    {footer && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '20px', borderTop: '4px solid #000', background: '#aa0000' }}>
        {footer}
      </div>
    )}
    <Deco />
  </div>
)

const Arcade = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stage, setStage] = useState('loading')
  const [myPokemon, setMyPokemon] = useState(null)
  const [rivalPokemon, setRivalPokemon] = useState(null)
  const [mySelectedMoves, setMySelectedMoves] = useState([])

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/battle'); return }

    const init = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        const starter = docSnap.exists() ? docSnap.data().starter : null
        if (!starter) { navigate('/battle'); return }

        const [myRes, rivalRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${starter.id}`),
          fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 151) + 1}`)
        ])
        setMyPokemon(await myRes.json())
        setRivalPokemon(await rivalRes.json())
        setStage('selectMoves')
      } catch (err) {
        console.error(err)
        navigate('/battle')
      }
    }
    init()
  }, [authLoading, user])

  const handleMovesConfirmed = (moves) => {
    setMySelectedMoves(moves)
    setStage('battle')
  }

  const handleFinish = () => {
    navigate('/battle')
  }

  if (stage === 'loading') return (
    <Shell title="MODO ARCADE">
      <p style={{ fontFamily: font, color: '#ffdd00', fontSize: '18px' }}>CARGANDO...</p>
    </Shell>
  )

  if (stage === 'selectMoves') return (
    <Shell title="MOVIMIENTOS" footer={<PixelBtn onClick={() => navigate('/battle')} color='#cc0000'>VOLVER</PixelBtn>}>
      <MoveSelector
        pokemon={myPokemon}
        onConfirm={handleMovesConfirmed}
        onCancel={() => navigate('/battle')}
      />
    </Shell>
  )

  if (stage === 'battle') return (
    <Shell title="MODO ARCADE">
      <ArcadeMode
        myPokemon={myPokemon}
        rivalPokemon={rivalPokemon}
        mySelectedMoves={mySelectedMoves}
        onFinish={handleFinish}
      />
    </Shell>
  )

  return null
}

export default Arcade