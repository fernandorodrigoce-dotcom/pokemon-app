import { useState, useEffect } from 'react'
import { ref, update } from 'firebase/database'
import { rtdb } from '../firebase'
import useAuth from '../hooks/autenticaciongoo/useAuth'
import usePvP from '../hooks/batalla/usePvP'
import useUnlocked from '../hooks/pokemon/useUnlocked'
import WaitingRoom from '../components/battle/pvp/WaitingRoom'
import PokemonSelector from '../components/battle/pvp/PokemonSelector'
import MoveSelector from '../components/battle/reutilizablepvp/MoveSelector'
import BattleArena from '../components/battle/pvp/BattleArena'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const PixelBtn = ({ onClick, children, color = "#cc0000", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#444" : color,
      color: color === "#ffdd00" ? "#000" : "#fff",
      fontFamily: "'Press Start 2P', cursive",
      fontSize: "14px",
      padding: "18px 36px",
      border: "4px solid #000",
      boxShadow: disabled ? "none" : "4px 4px 0 #000",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.boxShadow = "1px 1px 0 #000" }}
    onMouseUp={e => { if (!disabled) e.currentTarget.style.boxShadow = "4px 4px 0 #000" }}
  >
    {children}
  </button>
)

const Header = ({ title }) => (
  <div style={{ background: "#aa0000", borderBottom: "4px solid #000", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", gap: "10px" }}>
      {["#ff6666", "#ffdd00", "#66ff66"].map((c, i) => (
        <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", background: c, border: "2px solid #000" }} />
      ))}
    </div>
    <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "16px", color: "#ffdd00" }}>{title}</p>
    <div style={{ width: "40px", height: "8px", background: "#1a1a2e", border: "2px solid #000" }} />
  </div>
)

const Deco = () => (
  <div style={{ display: "flex", justifyContent: "center", gap: "10px", paddingBottom: "20px", paddingTop: "16px", background: "#aa0000", borderTop: "4px solid #000" }}>
    {[1,2,3,4].map((i) => (
      <div key={i} style={{ width: "28px", height: "10px", background: "#880000", border: "2px solid #000" }} />
    ))}
  </div>
)

const Shell = ({ title, children, footer }) => (
  <div style={{ minHeight: "100vh", width: "100%", background: "#cc0000", display: "flex", flexDirection: "column" }}>
    <Header title={title} />
    <div style={{ background: "#2a3a2a", margin: "16px", border: "4px solid #000", padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
      {children}
    </div>
    {footer && (
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "20px", borderTop: "4px solid #000", background: "#aa0000" }}>
        {footer}
      </div>
    )}
    <Deco />
  </div>
)

const PvP = () => {
  const { user } = useAuth()
  const { unlocked } = useUnlocked()
  const [starter, setStarter] = useState(null)
  const { roomId, roomData, error, loading, myKey, rivalKey, createRoom, joinRoom, savePokemons, leaveRoom, sendMessage, requestRematch } = usePvP(user)
  const [stage, setStage] = useState("lobby")
  const [joinCode, setJoinCode] = useState("")
  const [selectedPokemons, setSelectedPokemons] = useState([])
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0)
  const [pokemonsWithMoves, setPokemonsWithMoves] = useState([])
  const [fullCurrentPokemon, setFullCurrentPokemon] = useState(null)

  useEffect(() => {
    const loadStarter = async () => {
      if (!user) return
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().starter) {
          const s = userDoc.data().starter
          setStarter({ id: s.id, name: s.name, sprite: s.sprite })
        }
      } catch (err) { console.error(err) }
    }
    loadStarter()
  }, [user])

  useEffect(() => {
    if (stage !== "selectMoves" || !selectedPokemons[currentPokemonIndex]) return
    const load = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + selectedPokemons[currentPokemonIndex].id)
      setFullCurrentPokemon(await res.json())
    }
    load()
  }, [currentPokemonIndex, stage])

  // Si la sala desaparece (rival se fue o borro la sala), volver al lobby
  useEffect(() => {
    if (!roomData && (stage === "battle" || stage === "selectPokemons" || stage === "selectMoves" || stage === "waiting")) {
      setStage("lobby")
      setSelectedPokemons([])
      setPokemonsWithMoves([])
      setCurrentPokemonIndex(0)
      setFullCurrentPokemon(null)
    }
  }, [roomData])

  const myCollection = user ? [...(starter ? [starter] : []), ...(unlocked || [])] : []

  const handleCreateRoom = async () => { await createRoom(); setStage("waiting") }
  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return
    await joinRoom(joinCode.trim().toUpperCase()); setStage("waiting")
  }
  const handlePokemonsConfirmed = (pokemons) => { setSelectedPokemons(pokemons); setCurrentPokemonIndex(0); setStage("selectMoves") }
  const handleMovesConfirmed = async (moves) => {
    const updated = [...pokemonsWithMoves, { pokemon: fullCurrentPokemon, moves }]
    setPokemonsWithMoves(updated)
    if (currentPokemonIndex < 2) { setFullCurrentPokemon(null); setCurrentPokemonIndex(p => p + 1) }
    else {
      await savePokemons(updated)
      await update(ref(rtdb, "rooms/" + roomId + "/battle"), { phase: "choosingFirst", players: { player1: { activePokemon: 0, firstChosen: false }, player2: { activePokemon: 0, firstChosen: false } } })
      setStage("battle")
    }
  }
  const handleLeave = async () => {
    await leaveRoom(); setStage("lobby"); setSelectedPokemons([]); setPokemonsWithMoves([]); setCurrentPokemonIndex(0); setFullCurrentPokemon(null)
  }

  if (stage === "waiting" && roomData?.status === "selecting" && myKey) setStage("selectPokemons")

  const rivalDisconnected = roomData?.[rivalKey]?.disconnected

  if (stage === "selectMoves" && !fullCurrentPokemon) return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: "#ffdd00", fontSize: "18px" }}>CARGANDO...</p>
    </div>
  )

  if (rivalDisconnected && stage === "battle") return (
    <Shell title="PVP ONLINE">
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: "#ffdd00", fontSize: "20px" }}>GANASTE</p>
      <p style={{ fontFamily: "'Press Start 2P', cursive", color: "#4ade80", fontSize: "11px" }}>EL RIVAL SE DESCONECTO</p>
      <PixelBtn onClick={handleLeave} color="#ffdd00">VOLVER AL MENU</PixelBtn>
    </Shell>
  )

  if (stage === "lobby") return (
    <Shell title="PVP ONLINE" footer={<PixelBtn onClick={() => window.history.back()} color="#cc0000">VOLVER</PixelBtn>}>
      {error && <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "9px", color: "#ff6666" }}>{error}</p>}
      <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "11px", color: "#ffdd00" }}>ELIGE UN MODO</p>
      <PixelBtn onClick={handleCreateRoom} disabled={loading} color="#cc0000">CREAR SALA</PixelBtn>
      <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "9px", color: "#aaa" }}>— O —</p>
      <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "400px" }}>
        <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="CODIGO..." maxLength={6}
          style={{ flex: 1, background: "#1a1a2e", color: "#ffdd00", fontFamily: "'Press Start 2P', cursive", fontSize: "10px", padding: "12px", border: "4px solid #000", outline: "none", textTransform: "uppercase" }} />
        <PixelBtn onClick={handleJoinRoom} disabled={loading} color="#4444cc">UNIRSE</PixelBtn>
      </div>
    </Shell>
  )

  if (stage === "waiting") return (
    <Shell title="PVP ONLINE">
      <WaitingRoom roomId={roomId} roomData={roomData} myKey={myKey} rivalKey={rivalKey} onLeave={handleLeave} />
    </Shell>
  )

  if (stage === "selectPokemons") return (
    <Shell title="ELIGE TUS POKEMON">
      <PokemonSelector collection={myCollection} onConfirm={handlePokemonsConfirmed} onCancel={handleLeave} />
    </Shell>
  )

  if (stage === "selectMoves") return (
    <Shell title="MOVIMIENTOS">
      <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "9px", color: "#aaa" }}>POKEMON {currentPokemonIndex + 1} DE 3</p>
      <MoveSelector pokemon={fullCurrentPokemon} onConfirm={handleMovesConfirmed} onCancel={handleLeave} />
    </Shell>
  )

  if (stage === "battle") return (
    <Shell title="BATALLA PVP">
      <BattleArena roomId={roomId} myKey={myKey} rivalKey={rivalKey} roomData={roomData} onLeave={handleLeave} sendMessage={sendMessage} requestRematch={requestRematch} />
    </Shell>
  )

  return null
}

export default PvP