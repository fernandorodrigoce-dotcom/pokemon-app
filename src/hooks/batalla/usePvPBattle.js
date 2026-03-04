import { useState, useEffect, useRef } from 'react'
import { ref, update, onValue, get } from 'firebase/database'
import { rtdb } from '../../firebase'

const typeChart = { fire:{grass:2,water:0.5,fire:0.5,ice:2,bug:2,steel:2},water:{fire:2,water:0.5,grass:0.5,rock:2,ground:2},grass:{water:2,fire:0.5,grass:0.5,rock:2,ground:2},electric:{water:2,flying:2,electric:0.5,ground:0},normal:{rock:0.5,ghost:0},ice:{grass:2,ground:2,flying:2,dragon:2,fire:0.5,water:0.5,ice:0.5},fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,ghost:0,flying:0.5},poison:{grass:2,fairy:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0},ground:{fire:2,electric:2,poison:2,rock:2,steel:2,grass:0.5,bug:0.5,flying:0},flying:{grass:2,fighting:2,bug:2,electric:0.5,rock:0.5,steel:0.5},psychic:{fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5},bug:{grass:2,psychic:2,dark:2,fire:0.5,fighting:0.5,flying:0.5},rock:{fire:2,ice:2,flying:2,bug:2,fighting:0.5,ground:0.5,steel:0.5},ghost:{psychic:2,ghost:2,normal:0,dark:0.5},dragon:{dragon:2,steel:0.5,fairy:0},dark:{psychic:2,ghost:2,fighting:0.5,dark:0.5,fairy:0.5},steel:{ice:2,rock:2,fairy:2,fire:0.5,water:0.5,electric:0.5,steel:0.5},fairy:{fighting:2,dragon:2,dark:2,fire:0.5,poison:0.5,steel:0.5} }

const getTypeMultiplier = (moveType, defenderTypes) => { let m=1; defenderTypes.forEach(t=>{ const e=typeChart[moveType]?.[t]; if(e!==undefined) m*=e }); return m }

const calculateDamage = (attacker, move, defender) => {
  if (!move.power) return { damage:0,missed:true,typeMultiplier:1 }
  const level=50, isSpecial=move.damage_class?.name==='special'
  const atk = isSpecial ? attacker.stats.find(s=>s.stat.name==='special-attack').base_stat : attacker.stats.find(s=>s.stat.name==='attack').base_stat
  const def = isSpecial ? defender.stats.find(s=>s.stat.name==='special-defense').base_stat : defender.stats.find(s=>s.stat.name==='defense').base_stat
  const defTypes = defender.types.map(t=>typeof t==='string'?t:t.type.name)
  const atkTypes = attacker.types.map(t=>typeof t==='string'?t:t.type.name)
  const typeMultiplier = getTypeMultiplier(move.type?.name, defTypes)
  const hit = Math.random()*100<=(move.accuracy||100)
  if (!hit) return { damage:0,missed:true,typeMultiplier }
  const stab = atkTypes.includes(move.type?.name)?1.5:1
  const critical = Math.random()<0.06?2:1
  const random = 0.85+Math.random()*0.15
  const damage = Math.floor(((((2*level)/5+2)*move.power*(atk/def))/50+2)*stab*typeMultiplier*critical*random)
  return { damage,missed:false,typeMultiplier,critical:critical===2,stab:stab===1.5 }
}

const calcMaxHP = (baseHP) => Math.floor(((2*baseHP*50)/100)+50+10)

// MODELO SIMPLE:
// hps/player1 = HPs actuales del player1 (escritos por CUALQUIERA que los modifique)
// hps/player2 = HPs actuales del player2
// Cada jugador ESCUCHA sus propios HPs (los que el rival reduce)
// Y ESCUCHA los HPs del rival (para mostrarlos)

const usePvPBattle = (roomId, myKey, rivalKey, roomData) => {
  const battle = roomData?.battle
  const myTeamData = roomData?.[myKey]?.pokemons || []
  const rivalTeamData = roomData?.[rivalKey]?.pokemons || []

  const [myHPs, setMyHPs] = useState([])
  const [rivalHPs, setRivalHPs] = useState([])
  const myHPsRef = useRef([])
  const rivalHPsRef = useRef([])
  const sessionRef = useRef(-1)
  const initializedRef = useRef(false)

  const battlePhase = battle?.phase
  const battleSession = battle?.session ?? 0

  useEffect(() => {
    if (!myTeamData.length || !rivalTeamData.length) return
    if (battlePhase !== 'choosingFirst') return
    if (sessionRef.current === battleSession) return
    sessionRef.current = battleSession
    initializedRef.current = true
    const mHPs = myTeamData.map(p=>calcMaxHP(p.stats.find(s=>s.stat.name==='hp').base_stat))
    const rHPs = rivalTeamData.map(p=>calcMaxHP(p.stats.find(s=>s.stat.name==='hp').base_stat))
    myHPsRef.current = mHPs
    rivalHPsRef.current = rHPs
    setMyHPs([...mHPs])
    setRivalHPs([...rHPs])
    update(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+myKey), { 0:mHPs[0],1:mHPs[1],2:mHPs[2] })
  }, [battlePhase, battleSession, myTeamData.length, rivalTeamData.length])

  useEffect(() => {
    if (!roomId) return
    const unsub = onValue(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+myKey), (snap) => {
      const data = snap.val()
      if (!data) return
      const hps = [data[0], data[1], data[2]]
      if (hps.some(h=>h==null)) return
      myHPsRef.current = hps
      setMyHPs([...hps])
    })
    return () => unsub()
  }, [roomId, myKey])

  useEffect(() => {
    if (!roomId) return
    const unsub = onValue(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+rivalKey), (snap) => {
      const data = snap.val()
      if (!data) return
      const hps = [data[0], data[1], data[2]]
      if (hps.some(h=>h==null)) return
      rivalHPsRef.current = hps
      setRivalHPs([...hps])
    })
    return () => unsub()
  }, [roomId, rivalKey])

  const myActivePokemonIndex = battle?.players?.[myKey]?.activePokemon ?? 0
  const rivalActivePokemonIndex = battle?.players?.[rivalKey]?.activePokemon ?? 0
  const isMyTurn = battle?.turn === myKey
  const winner = battle?.winner
  const log = battle?.log || []

  const myActivePokemon = myTeamData[myActivePokemonIndex]
  const rivalActivePokemon = rivalTeamData[rivalActivePokemonIndex]

  const chooseFirstPokemon = async (index) => {
    await update(ref(rtdb,'rooms/'+roomId+'/battle/players/'+myKey), { activePokemon:index,firstChosen:true })
    const snap = await get(ref(rtdb,'rooms/'+roomId+'/battle/players'))
    const players = snap.val()
    if (players?.[rivalKey]?.firstChosen) {
      const mySpeed = myTeamData[index].stats.find(s=>s.stat.name==='speed').base_stat
      const rivalIdx2 = players[rivalKey].activePokemon
      const rivalSpeed = rivalTeamData[rivalIdx2].stats.find(s=>s.stat.name==='speed').base_stat
      const firstTurn = mySpeed>rivalSpeed ? myKey : rivalSpeed>mySpeed ? rivalKey : (Math.random()<0.5?myKey:rivalKey)
      await update(ref(rtdb,'rooms/'+roomId+'/battle'), { phase:'fighting',turn:firstTurn })
    }
  }

  const attack = async (move) => {
    if (!isMyTurn || battlePhase !== 'fighting') return
    const rivalIdx = rivalActivePokemonIndex
    const { damage,missed,typeMultiplier,critical,stab } = calculateDamage(myActivePokemon,move,rivalActivePokemon)

    const newRivalHP = Math.max(0, rivalHPsRef.current[rivalIdx]-damage)
    const newRivalHPs = [...rivalHPsRef.current]
    newRivalHPs[rivalIdx] = newRivalHP
    rivalHPsRef.current = newRivalHPs
    setRivalHPs([...newRivalHPs])

    let logMsg = missed ? myActivePokemon.name+' fallo '+move.name+'!' : myActivePokemon.name+' uso '+move.name+' -> '+damage+' dano'
    if (!missed && typeMultiplier>1) logMsg += ' Es muy eficaz!'
    if (!missed && typeMultiplier<1 && typeMultiplier>0) logMsg += ' No es muy eficaz...'
    if (!missed && typeMultiplier===0) logMsg += ' No afecta...'
    if (!missed && critical) logMsg += ' Golpe critico!'
    if (!missed && stab) logMsg += ' (STAB)'
    const newLog = [logMsg,...log].slice(0,20)
    const rivalFainted = newRivalHP<=0
    const rivalRemaining = newRivalHPs.filter(hp=>hp>0).length

    if (rivalFainted && rivalRemaining===0) {
      await update(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+rivalKey), { [rivalIdx]:0 })
      await update(ref(rtdb,'rooms/'+roomId+'/battle'), { log:newLog,phase:'finished',winner:myKey,turn:null })
    } else if (rivalFainted) {
      const faintedLog = [rivalActivePokemon.name+' se debilito!',...newLog].slice(0,20)
      await update(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+rivalKey), { [rivalIdx]:0 })
      await update(ref(rtdb,'rooms/'+roomId+'/battle'), { log:faintedLog,phase:'switchPokemon',switchingPlayer:rivalKey,turn:null })
    } else {
      await update(ref(rtdb,'rooms/'+roomId+'/battle/hps/'+rivalKey), { [rivalIdx]:newRivalHP })
      await update(ref(rtdb,'rooms/'+roomId+'/battle'), { log:newLog,turn:rivalKey })
    }
  }

  const switchPokemon = async (index) => {
    if (battlePhase!=='switchPokemon'||roomData?.battle?.switchingPlayer!==myKey) return
    const nextTurn = myKey==='player1'?'player2':'player1'
    const switchLog = [myTeamData[index].name+' salio a batalla!',...log].slice(0,20)
    await update(ref(rtdb,'rooms/'+roomId+'/battle/players/'+myKey), { activePokemon:index })
    await update(ref(rtdb,'rooms/'+roomId+'/battle'), { phase:'fighting',turn:nextTurn,log:switchLog,switchingPlayer:null })
  }

  const myMaxHPs = myTeamData.map(p=>calcMaxHP(p.stats.find(s=>s.stat.name==='hp').base_stat))
  const rivalMaxHPs = rivalTeamData.map(p=>calcMaxHP(p.stats.find(s=>s.stat.name==='hp').base_stat))

  return { myTeam:myTeamData,rivalTeam:rivalTeamData,myActivePokemon,rivalActivePokemon,myActivePokemonIndex,rivalActivePokemonIndex,myHPs,rivalHPs,myMaxHPs,rivalMaxHPs,isMyTurn,battlePhase,winner,log,chooseFirstPokemon,attack,switchPokemon }
}

export default usePvPBattle