import { useState, useEffect, useRef } from 'react'

const typeChart = {
  fire:{grass:2,water:0.5,fire:0.5,ice:2,bug:2,steel:2},
  water:{fire:2,water:0.5,grass:0.5,rock:2,ground:2},
  grass:{water:2,fire:0.5,grass:0.5,rock:2,ground:2},
  electric:{water:2,flying:2,electric:0.5,ground:0},
  normal:{rock:0.5,ghost:0},
  ice:{grass:2,ground:2,flying:2,dragon:2,fire:0.5,water:0.5,ice:0.5},
  fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,ghost:0,flying:0.5},
  poison:{grass:2,fairy:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0},
  ground:{fire:2,electric:2,poison:2,rock:2,steel:2,grass:0.5,bug:0.5,flying:0},
  flying:{grass:2,fighting:2,bug:2,electric:0.5,rock:0.5,steel:0.5},
  psychic:{fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5},
  bug:{grass:2,psychic:2,dark:2,fire:0.5,fighting:0.5,flying:0.5},
  rock:{fire:2,ice:2,flying:2,bug:2,fighting:0.5,ground:0.5,steel:0.5},
  ghost:{psychic:2,ghost:2,normal:0,dark:0.5},
  dragon:{dragon:2,steel:0.5,fairy:0},
  dark:{psychic:2,ghost:2,fighting:0.5,dark:0.5,fairy:0.5},
  steel:{ice:2,rock:2,fairy:2,fire:0.5,water:0.5,electric:0.5,steel:0.5},
  fairy:{fighting:2,dragon:2,dark:2,fire:0.5,poison:0.5,steel:0.5},
}

const getTypeMultiplier = (moveType, defenderTypes) => {
  let m = 1
  defenderTypes.forEach(t => { const e = typeChart[moveType]?.[t]; if (e !== undefined) m *= e })
  return m
}

const calculateDamage = (attacker, move, defender) => {
  if (!move.power) return { damage: 0, missed: true, typeMultiplier: 1 }
  const level = 50
  const isSpecial = move.damage_class?.name === 'special'
  const atk = isSpecial
    ? attacker.stats.find(s => s.stat.name === 'special-attack').base_stat
    : attacker.stats.find(s => s.stat.name === 'attack').base_stat
  const def = isSpecial
    ? defender.stats.find(s => s.stat.name === 'special-defense').base_stat
    : defender.stats.find(s => s.stat.name === 'defense').base_stat
  const defTypes = defender.types.map(t => typeof t === 'string' ? t : t.type.name)
  const atkTypes = attacker.types.map(t => typeof t === 'string' ? t : t.type.name)
  const typeMultiplier = getTypeMultiplier(move.type?.name, defTypes)
  const hit = Math.random() * 100 <= (move.accuracy || 100)
  if (!hit) return { damage: 0, missed: true, typeMultiplier }
  const stab = atkTypes.includes(move.type?.name) ? 1.5 : 1
  const critical = Math.random() < 0.06 ? 2 : 1
  const random = 0.85 + Math.random() * 0.15
  const damage = Math.floor(((((2 * level) / 5 + 2) * move.power * (atk / def)) / 50 + 2) * stab * typeMultiplier * critical * random)
  return { damage, missed: false, typeMultiplier, critical: critical === 2, stab: stab === 1.5 }
}

const calcMaxHP = (baseHP) => Math.floor(((2 * baseHP * 50) / 100) + 50 + 10)

const useBattle = (myPokemon, rivalPokemon, mySelectedMoves) => {
  const myMaxHP = myPokemon ? calcMaxHP(myPokemon.stats.find(s => s.stat.name === 'hp').base_stat) : 0
  const rivalMaxHP = rivalPokemon ? calcMaxHP(rivalPokemon.stats.find(s => s.stat.name === 'hp').base_stat) : 0

  const [myHP, setMyHP] = useState(myMaxHP)
  const [rivalHP, setRivalHP] = useState(rivalMaxHP)
  const [isMyTurn, setIsMyTurn] = useState(true)
  const [battleOver, setBattleOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(false)

  const myHPRef = useRef(myMaxHP)
  const rivalHPRef = useRef(rivalMaxHP)
  const battleOverRef = useRef(false)

  // Movimientos del rival — los 4 primeros moves con power del rival
  const [rivalMoves, setRivalMoves] = useState([])

  useEffect(() => {
    if (!rivalPokemon) return
    const loadRivalMoves = async () => {
      setLoading(true)
      const movesWithUrl = rivalPokemon.moves.slice(0, 40).map(m => m.move.url)
      const details = await Promise.all(movesWithUrl.map(url => fetch(url).then(r => r.json())))
      const withPower = details.filter(m => m.power).slice(0, 4)
      setRivalMoves(withPower)
      setLoading(false)
    }
    loadRivalMoves()
  }, [rivalPokemon])

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 20))

  const rivalAttack = () => {
    if (battleOverRef.current || rivalMoves.length === 0) return
    const move = rivalMoves[Math.floor(Math.random() * rivalMoves.length)]
    const { damage, missed, typeMultiplier, critical } = calculateDamage(rivalPokemon, move, myPokemon)
    const newHP = Math.max(0, myHPRef.current - damage)
    myHPRef.current = newHP
    setMyHP(newHP)

    let logMsg = missed
      ? `${rivalPokemon.name} fallo ${move.name}!`
      : `${rivalPokemon.name} uso ${move.name} -> ${damage} daño`
    if (!missed && typeMultiplier > 1) logMsg += ' ¡Es muy eficaz!'
    if (!missed && typeMultiplier < 1 && typeMultiplier > 0) logMsg += ' No es muy eficaz...'
    if (!missed && typeMultiplier === 0) logMsg += ' No afecta...'
    if (!missed && critical) logMsg += ' ¡Golpe critico!'
    addLog(logMsg)

    if (newHP <= 0) {
      battleOverRef.current = true
      setBattleOver(true)
      setWinner('rival')
    } else {
      setIsMyTurn(true)
    }
  }

  const attack = (move) => {
    if (!isMyTurn || battleOver) return
    const { damage, missed, typeMultiplier, critical, stab } = calculateDamage(myPokemon, move, rivalPokemon)
    const newHP = Math.max(0, rivalHPRef.current - damage)
    rivalHPRef.current = newHP
    setRivalHP(newHP)

    let logMsg = missed
      ? `${myPokemon.name} fallo ${move.name}!`
      : `${myPokemon.name} uso ${move.name} -> ${damage} daño`
    if (!missed && typeMultiplier > 1) logMsg += ' ¡Es muy eficaz!'
    if (!missed && typeMultiplier < 1 && typeMultiplier > 0) logMsg += ' No es muy eficaz...'
    if (!missed && typeMultiplier === 0) logMsg += ' No afecta...'
    if (!missed && critical) logMsg += ' ¡Golpe critico!'
    if (!missed && stab) logMsg += ' (STAB)'
    addLog(logMsg)

    if (newHP <= 0) {
      battleOverRef.current = true
      setBattleOver(true)
      setWinner('me')
      return
    }

    setIsMyTurn(false)
    setTimeout(() => rivalAttack(), 1200)
  }

  return {
    myHP,
    rivalHP,
    myMaxHP,
    rivalMaxHP,
    myMoves: mySelectedMoves || [],
    log,
    isMyTurn,
    battleOver,
    winner,
    loading,
    attack,
  }
}

export default useBattle