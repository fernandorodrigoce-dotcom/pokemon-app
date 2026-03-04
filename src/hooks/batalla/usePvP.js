import { useState, useEffect, useRef } from 'react'
import { ref, set, get, onValue, update, remove, onDisconnect } from 'firebase/database'
import { rtdb } from '../../firebase'

// Generar codigo de sala aleatorio
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

const usePvP = (user) => {
  const [roomId, setRoomId] = useState(null)
  const [roomData, setRoomData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const playerKey = useRef(null)

  // Escuchar cambios en la sala en tiempo real
  useEffect(() => {
    if (!roomId) return
    const roomRef = ref(rtdb, `rooms/${roomId}`)
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        setRoomData(null)
        setRoomId(null)
        return
      }
      setRoomData(data)
    })
    return () => unsubscribe()
  }, [roomId])

  // Crear sala
  const createRoom = async () => {
    setLoading(true)
    setError(null)
    const code = generateRoomCode()
    const roomRef = ref(rtdb, `rooms/${code}`)
    await set(roomRef, {
      status: 'waiting',
      createdAt: Date.now(),
      player1: {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        ready: false,
        pokemons: [],
        currentPokemon: 0,
        disconnected: false,
      },
      player2: null,
      battle: { turn: 'player1', lastAction: Date.now(), log: [] },
      chat: { messages: [] },
      rematch: { player1: false, player2: false },
    })

    // Si se desconecta marcar como desconectado
    const disconnectRef = ref(rtdb, `rooms/${code}/player1/disconnected`)
    onDisconnect(disconnectRef).set(true)

    playerKey.current = 'player1'
    setRoomId(code)
    setLoading(false)
    return code
  }

  // Unirse a sala
  const joinRoom = async (code) => {
    setLoading(true)
    setError(null)
    const roomRef = ref(rtdb, `rooms/${code}`)
    const snapshot = await get(roomRef)

    if (!snapshot.exists()) {
      setError('La sala no existe')
      setLoading(false)
      return
    }

    const data = snapshot.val()

    if (data.player2) {
      setError('La sala ya está llena')
      setLoading(false)
      return
    }

    if (data.status !== 'waiting') {
      setError('La sala ya comenzó')
      setLoading(false)
      return
    }

    await update(roomRef, {
      'player2/uid': user.uid,
      'player2/name': user.displayName,
      'player2/photo': user.photoURL,
      'player2/ready': false,
      'player2/pokemons': [],
      'player2/currentPokemon': 0,
      'player2/disconnected': false,
      status: 'selecting',
    })

    const disconnectRef = ref(rtdb, `rooms/${code}/player2/disconnected`)
    onDisconnect(disconnectRef).set(true)

    playerKey.current = 'player2'
    setRoomId(code)
    setLoading(false)
  }

  // Guardar pokémons y movimientos elegidos
  const savePokemons = async (pokemons) => {
    if (!roomId || !playerKey.current) return
    await update(ref(rtdb, `rooms/${roomId}/${playerKey.current}`), {
      pokemons: pokemons.map((p) => ({
  id: p.pokemon.id,
  name: p.pokemon.name,
  sprite: p.pokemon.sprite ?? p.pokemon.sprites?.front_default,
  backSprite: p.pokemon.backSprite ?? p.pokemon.sprites?.back_default,
  types: p.pokemon.types.map((t) => t.type?.name ?? t),
  stats: p.pokemon.stats,
  moves: p.moves,
})),
      ready: true,
    })
  }

  // Enviar ataque
  const sendAttack = async (move) => {
    if (!roomId) return
    await update(ref(rtdb, `rooms/${roomId}/battle`), {
      lastAction: Date.now(),
      lastMove: {
        player: playerKey.current,
        moveId: move.id,
        moveName: move.name,
      },
    })
  }

  // Enviar mensaje al chat
  const sendMessage = async (text) => {
    if (!roomId) return
    const messagesRef = ref(rtdb, `rooms/${roomId}/chat/messages`)
    const snapshot = await get(messagesRef)
    const messages = snapshot.val() || []
    await set(messagesRef, [
      ...messages,
      {
        uid: user.uid,
        name: user.displayName,
        text,
        timestamp: Date.now(),
      },
    ])
  }

  // Pedir revancha
  const requestRematch = async () => {
    if (!roomId || !playerKey.current) return
    await update(ref(rtdb, `rooms/${roomId}/rematch`), {
      [playerKey.current]: true,
    })
  }

  // Salir de la sala
  const leaveRoom = async () => {
    if (!roomId) return
    await remove(ref(rtdb, `rooms/${roomId}`))
    setRoomId(null)
    setRoomData(null)
    playerKey.current = null
  }

  const isPlayer1 = playerKey.current === 'player1'
  const myKey = playerKey.current
  const rivalKey = isPlayer1 ? 'player2' : 'player1'

  return {
    roomId, roomData, error, loading,
    myKey, rivalKey, isPlayer1,
    createRoom, joinRoom, savePokemons,
    sendAttack, sendMessage, requestRematch, leaveRoom,
  }
}

export default usePvP