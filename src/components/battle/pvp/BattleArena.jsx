import { useState, useEffect, useRef } from 'react'
import { ref, update, remove } from 'firebase/database'
import { rtdb } from '../../../firebase'
import usePvPBattle from '../../../hooks/batalla/usePvPBattle'
import BattleChat from './BattleChat'

const font = "'Press Start 2P', cursive"

const typeColors = { fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',fairy:'#EE99AC',normal:'#A8A878',fighting:'#C03028',flying:'#A890F0',poison:'#A040A0',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',ghost:'#705898',steel:'#B8B8D0' }

const HPBar = ({ current, max }) => {
  const percent = Math.max(0,(current/max)*100)
  const color = percent>50?'#4ade80':percent>20?'#ffdd00':'#cc2200'
  return <div style={{ width:'100%',background:'#1a1a2e',border:'2px solid #000',height:'12px' }}><div style={{ width:percent+'%',height:'100%',background:color,transition:'width 0.4s' }} /></div>
}

const PokemonCard = ({ pokemon, hp, maxHP, isActive, fainted }) => (
  <div style={{ border:isActive?'3px solid #ffdd00':'3px solid #444',boxShadow:isActive?'4px 4px 0 #000,0 0 10px rgba(255,221,0,0.4)':'4px 4px 0 #000',background:'rgba(0,0,0,0.4)',padding:'10px',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',opacity:fainted?0.4:1,flex:1 }}>
    <img src={pokemon.sprite} alt={pokemon.name} style={{ width:'64px',height:'64px',imageRendering:'pixelated' }} />
    <p style={{ fontFamily:font,fontSize:'6px',color:'#fff',textTransform:'capitalize' }}>{pokemon.name}</p>
    <p style={{ fontFamily:font,fontSize:'5px',color:'#aaa' }}>{Math.max(0,hp)}/{maxHP}</p>
    <HPBar current={hp} max={maxHP} />
  </div>
)

const PixelBtn = ({ onClick, disabled, color='#cc0000', children }) => (
  <button onClick={onClick} disabled={disabled} style={{ fontFamily:font,fontSize:'14px',background:disabled?'#444':color,color:color==='#ffdd00'?'#000':'#fff',border:'4px solid #000',boxShadow:disabled?'none':'4px 4px 0 #000',padding:'18px 36px',cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1 }}
    onMouseDown={e=>{ if(!disabled) e.currentTarget.style.boxShadow='1px 1px 0 #000' }}
    onMouseUp={e=>{ if(!disabled) e.currentTarget.style.boxShadow='4px 4px 0 #000' }}
  >{children}</button>
)

const BattleArena = ({ roomId, myKey, rivalKey, roomData, onLeave, sendMessage, requestRematch }) => {
  const { myTeam,rivalTeam,myActivePokemon,rivalActivePokemon,myActivePokemonIndex,rivalActivePokemonIndex,myHPs,rivalHPs,myMaxHPs,rivalMaxHPs,isMyTurn,battlePhase,winner,log,chooseFirstPokemon,attack,switchPokemon } = usePvPBattle(roomId,myKey,rivalKey,roomData)
  const [rematchRequested, setRematchRequested] = useState(false)
  const [rematchCountdown, setRematchCountdown] = useState(null)
  const countdownRef = useRef(null)
  const messages = roomData?.chat?.messages || []
  const myUid = roomData?.[myKey]?.uid
  const myFirstChosen = roomData?.battle?.players?.[myKey]?.firstChosen
  const rematch = roomData?.rematch
  const rivalWantsRematch = rematch?.[rivalKey] && !rematch?.[myKey]
  const bothWantRematch = rematch?.[myKey] && rematch?.[rivalKey]
  const rivalDisconnected = roomData?.[rivalKey]?.disconnected

  useEffect(() => {
    if (!roomData && roomId) onLeave()
  }, [roomData])

  useEffect(() => {
    if (rivalWantsRematch && rematchCountdown === null) {
      setRematchCountdown(10)
    }
    if (!rivalWantsRematch) {
      setRematchCountdown(null)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [rivalWantsRematch])

  useEffect(() => {
    if (rematchCountdown === null) return
    if (rematchCountdown <= 0) {
      clearInterval(countdownRef.current)
      return
    }
    countdownRef.current = setInterval(() => setRematchCountdown(p => p-1), 1000)
    return () => clearInterval(countdownRef.current)
  }, [rematchCountdown])

  useEffect(() => {
    if (!bothWantRematch) return
    const resetBattle = async () => {
      const { get } = await import('firebase/database')
      const snap = await get(ref(rtdb,'rooms/'+roomId+'/battle'))
      const currentSession = snap.val()?.session || 0
      await update(ref(rtdb,'rooms/'+roomId+'/battle'), {
        phase:'choosingFirst',turn:null,winner:null,log:[],hps:null,session:currentSession+1,
        players:{ player1:{activePokemon:0,firstChosen:false},player2:{activePokemon:0,firstChosen:false} },
      })
      await update(ref(rtdb,'rooms/'+roomId+'/rematch'), { player1:false,player2:false })
      setRematchRequested(false)
      setRematchCountdown(null)
    }
    resetBattle()
  }, [bothWantRematch])

  const cardStyle = { background:'rgba(0,0,0,0.4)',border:'3px solid #444',boxShadow:'4px 4px 0 #000',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',cursor:'pointer',flex:1,maxWidth:'200px' }

  if (battlePhase === 'choosingFirst') return (
    <div style={{ width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:'24px' }}>
      <p style={{ fontFamily:font,fontSize:'11px',color:'#ffdd00' }}>ELIGE TU PRIMER POKEMON</p>
      {myFirstChosen ? (
        <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #4ade80',padding:'20px 40px' }}><p style={{ fontFamily:font,fontSize:'9px',color:'#4ade80' }}>ESPERANDO AL RIVAL...</p></div>
      ) : (
        <div style={{ display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',width:'100%' }}>
          {myTeam.map((pokemon,i) => (
            <div key={pokemon.id} onClick={() => chooseFirstPokemon(i)} style={cardStyle} onMouseEnter={e=>e.currentTarget.style.border='3px solid #ffdd00'} onMouseLeave={e=>e.currentTarget.style.border='3px solid #444'}>
              <img src={pokemon.sprite} alt={pokemon.name} style={{ width:'100px',height:'100px',imageRendering:'pixelated' }} />
              <p style={{ fontFamily:font,fontSize:'8px',color:'#fff',textTransform:'capitalize' }}>{pokemon.name}</p>
              <p style={{ fontFamily:font,fontSize:'6px',color:'#aaa' }}>VEL: {pokemon.stats.find(s=>s.stat.name==='speed').base_stat}</p>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontFamily:font,fontSize:'15px',color:'#555' }}>EL RIVAL NO PUEDE VER TU EQUIPO AUN</p>
    </div>
  )

  if (battlePhase === 'switchPokemon') {
    const iMustSwitch = roomData?.battle?.switchingPlayer === myKey
    return (
      <div style={{ width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:'24px' }}>
        {iMustSwitch ? (
          <>
            <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #ff6666',padding:'20px 40px',textAlign:'center' }}>
              <p style={{ fontFamily:font,fontSize:'11px',color:'#ffdd00' }}>TU POKEMON SE DEBILITO</p>
              <p style={{ fontFamily:font,fontSize:'8px',color:'#aaa',marginTop:'10px' }}>ELIGE OTRO</p>
            </div>
            <div style={{ display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',width:'100%' }}>
              {myTeam.map((pokemon,i) => {
                if (myHPs[i]<=0) return null
                return (<div key={pokemon.id} onClick={()=>switchPokemon(i)} style={cardStyle} onMouseEnter={e=>e.currentTarget.style.border='3px solid #ffdd00'} onMouseLeave={e=>e.currentTarget.style.border='3px solid #444'}>
                  <img src={pokemon.sprite} alt={pokemon.name} style={{ width:'100px',height:'100px',imageRendering:'pixelated' }} />
                  <p style={{ fontFamily:font,fontSize:'12px',color:'#fff',textTransform:'capitalize' }}>{pokemon.name}</p>
                  <p style={{ fontFamily:font,fontSize:'10px',color:'#4ade80' }}>{myHPs[i]} HP</p>
                </div>)
              })}
            </div>
          </>
        ) : (<div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #444',padding:'20px 40px' }}><p style={{ fontFamily:font,fontSize:'9px',color:'#aaa' }}>EL RIVAL ESTA ELIGIENDO...</p></div>)}
      </div>
    )
  }

  if (battlePhase === 'finished') {
    const iWon = winner === myKey
    return (
      <div style={{ width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:'24px' }}>
        <div style={{ background:'rgba(0,0,0,0.4)',border:iWon?'3px solid #ffdd00':'3px solid #ff6666',boxShadow:'4px 4px 0 #000',padding:'32px 64px',textAlign:'center' }}>
          <p style={{ fontFamily:font,fontSize:'20px',color:iWon?'#ffdd00':'#ff6666' }}>{iWon?'GANASTE':'PERDISTE'}</p>
        </div>
        {rivalWantsRematch && rematchCountdown !== null && (
          <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #ffdd00',padding:'16px 32px',textAlign:'center' }}>
            <p style={{ fontFamily:font,fontSize:'9px',color:'#ffdd00' }}>EL RIVAL PIDE REVANCHA</p>
            <p style={{ fontFamily:font,fontSize:'14px',color:'#fff',marginTop:'8px' }}>{rematchCountdown}s</p>
          </div>
        )}
        <div style={{ display:'flex',gap:'16px' }}>
          <PixelBtn onClick={async()=>{ await remove(ref(rtdb,'rooms/'+roomId)); onLeave() }} color='#444'>MENU</PixelBtn>
          <PixelBtn onClick={async()=>{ setRematchRequested(true); await requestRematch() }} disabled={rematchRequested} color='#ffdd00'>{rematchRequested?'ESPERANDO...':'REVANCHA'}</PixelBtn>
        </div>
        <BattleChat messages={messages} onSend={sendMessage} myUid={myUid} />
      </div>
    )
  }

  if (!myActivePokemon || !rivalActivePokemon) return (<div style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}><p style={{ fontFamily:font,fontSize:'18px',color:'#ffdd00' }}>CARGANDO...</p></div>)

  return (
    <div style={{ width:'100%',display:'flex',flexDirection:'column',gap:'16px' }}>

      <div style={{ display:'flex',gap:'16px' }}>
        <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'6px' }}>
          <p style={{ fontFamily:font,fontSize:'7px',color:'#ff6666',textAlign:'center' }}>— RIVAL —</p>
          <div style={{ display:'flex',gap:'8px' }}>{rivalTeam.map((pokemon,i)=><PokemonCard key={pokemon.id} pokemon={pokemon} hp={rivalHPs[i]??rivalMaxHPs[i]} maxHP={rivalMaxHPs[i]} isActive={i===rivalActivePokemonIndex} fainted={(rivalHPs[i]??rivalMaxHPs[i])<=0} />)}</div>
        </div>
        <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'6px' }}>
          <p style={{ fontFamily:font,fontSize:'7px',color:'#4ade80',textAlign:'center' }}>— TU —</p>
          <div style={{ display:'flex',gap:'8px' }}>{myTeam.map((pokemon,i)=><PokemonCard key={pokemon.id} pokemon={pokemon} hp={myHPs[i]??myMaxHPs[i]} maxHP={myMaxHPs[i]} isActive={i===myActivePokemonIndex} fainted={(myHPs[i]??myMaxHPs[i])<=0} />)}</div>
        </div>
      </div>

      <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #444',boxShadow:'4px 4px 0 #000',display:'flex',alignItems:'center',justifyContent:'space-around',padding:'24px' }}>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'8px' }}>
          <img src={rivalActivePokemon.sprite} alt={rivalActivePokemon.name} style={{ width:'120px',height:'120px',imageRendering:'pixelated' }} />
          <p style={{ fontFamily:font,fontSize:'8px',color:'#fff',textTransform:'capitalize' }}>{rivalActivePokemon.name}</p>
        </div>
        <div style={{ background:'#cc0000',border:'4px solid #000',boxShadow:'4px 4px 0 #000',padding:'10px 20px' }}><p style={{ fontFamily:font,fontSize:'16px',color:'#ffdd00' }}>VS</p></div>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'8px' }}>
          <img src={myActivePokemon.sprite} alt={myActivePokemon.name} style={{ width:'120px',height:'120px',imageRendering:'pixelated' }} />
          <p style={{ fontFamily:font,fontSize:'8px',color:'#fff',textTransform:'capitalize' }}>{myActivePokemon.name}</p>
        </div>
      </div>

      <div style={{ textAlign:'center' }}>
        {isMyTurn
          ? <p style={{ fontFamily:font,fontSize:'9px',color:'#ffdd00',background:'rgba(0,0,0,0.4)',border:'3px solid #ffdd00',padding:'10px 24px',display:'inline-block',boxShadow:'4px 4px 0 #000' }}>TU TURNO</p>
          : <p style={{ fontFamily:font,fontSize:'9px',color:'#aaa',background:'rgba(0,0,0,0.3)',border:'3px solid #444',padding:'10px 24px',display:'inline-block' }}>TURNO DEL RIVAL...</p>
        }
      </div>

      <div style={{ width:'100%' }}>
        <p style={{ fontFamily:font,fontSize:'9px',color:'#ffdd00',marginBottom:'12px' }}>MOVIMIENTOS DE {myActivePokemon.name.toUpperCase()}</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
          {myActivePokemon.moves.map((move) => {
            const mc = typeColors[move.type?.name] || '#A8A878'
            return (
              <button key={move.id} onClick={()=>attack(move)} disabled={!isMyTurn}
                style={{ fontFamily:font,textAlign:'left',padding:'20px',background:isMyTurn?mc:'rgba(0,0,0,0.3)',border:isMyTurn?'3px solid #000':'3px solid #333',boxShadow:isMyTurn?'4px 4px 0 #000':'none',cursor:isMyTurn?'pointer':'not-allowed',opacity:isMyTurn?1:0.5,display:'flex',flexDirection:'column',gap:'8px' }}
                onMouseDown={e=>{ if(isMyTurn) e.currentTarget.style.boxShadow='1px 1px 0 #000' }}
                onMouseUp={e=>{ if(isMyTurn) e.currentTarget.style.boxShadow='4px 4px 0 #000' }}
              >
                <p style={{ fontSize:'10px',color:'#000',textTransform:'capitalize' }}>{move.name}</p>
                <p style={{ fontSize:'7px',color:'#000',opacity:0.8 }}>{move.type?.name?.toUpperCase()} | {move.damage_class?.name?.toUpperCase()}</p>
                <div style={{ display:'flex',gap:'16px' }}>
                  <p style={{ fontSize:'8px',color:'#000' }}>POD: {move.power}</p>
                  <p style={{ fontSize:'8px',color:'#000' }}>PREC: {move.accuracy}%</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #444',boxShadow:'4px 4px 0 #000',padding:'14px',height:'120px',overflowY:'auto' }}>
        {log.map((msg,i)=><p key={i} style={{ fontFamily:font,fontSize:'15px',color:'#4ade80',marginBottom:'6px',lineHeight:1.8 }}>&#9658; {msg}</p>)}
      </div>

      <BattleChat messages={messages} onSend={sendMessage} myUid={myUid} />
    </div>
  )
}

export default BattleArena