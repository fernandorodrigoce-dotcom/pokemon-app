import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/autenticaciongoo/useAuth'

const ADMIN_UID = 'EcLvmjYGALXSOI4MK6LnI6uthpM2'

const Admin = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [pokemonSearch, setPokemonSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPokemons, setSelectedPokemons] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'))
      const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }))
      setUsers(list)
    }
    loadUsers()
  }, [])

  if (!user || user.uid !== ADMIN_UID) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500 font-bold">Acceso denegado ⛔</p>
    </div>
  )

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const handlePokemonSearch = async (e) => {
    const value = e.target.value
    setPokemonSearch(value)
    if (value.length < 2) { setSuggestions([]); return }
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      const data = await res.json()
      const matches = data.results
        .filter((p) => p.name.includes(value.toLowerCase()))
        .slice(0, 5)
      setSuggestions(matches)
    } catch { setSuggestions([]) }
  }

  const handleSelectSuggestion = async (s) => {
    setSuggestions([])
    setPokemonSearch('')
    try {
      const res = await fetch(s.url)
      const pokemon = await res.json()
      const found = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.front_default,
        types: pokemon.types.map((t) => t.type.name),
      }
      if (!selectedPokemons.find((p) => p.id === found.id)) {
        setSelectedPokemons((prev) => [...prev, found])
      }
    } catch {
      showToast('❌ Error al cargar el pokémon', 'error')
    }
  }

  const removePokemon = (id) => {
    setSelectedPokemons((prev) => prev.filter((p) => p.id !== id))
  }

  const handleGive = async () => {
    if (!selectedUser || selectedPokemons.length === 0) return
    setLoading(true)
    try {
      const userRef = doc(db, 'users', selectedUser.uid)
      await updateDoc(userRef, {
        unlocked: arrayUnion(...selectedPokemons),
      })
      showToast(`✅ ${selectedPokemons.length} pokémon(s) enviados a ${selectedUser.email}`)
      // Solo limpiamos el usuario seleccionado, los pokémons se mantienen
      setSelectedUser(null)
    } catch (err) {
      showToast(`❌ Error: ${err.message}`, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center min-h-screen gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Panel Admin 🛡️</h1>

      <div className="flex gap-6 w-full">

        {/* Columna usuarios */}
        <div className="flex flex-col gap-2 w-1/2">
          <h2 className="font-bold">1. Selecciona usuario</h2>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Buscar por correo..."
            className="border px-3 py-2 rounded text-sm"
          />
          <div className="border rounded-lg h-48 overflow-y-auto">
            {filteredUsers.map((u) => (
              <div
                key={u.uid}
                onClick={() => setSelectedUser(u)}
                className={`p-2 cursor-pointer text-sm border-b hover:bg-gray-50 ${
                  selectedUser?.uid === u.uid ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <p className="font-medium">{u.email}</p>
                <p className="text-xs text-gray-400 truncate">{u.uid}</p>
              </div>
            ))}
          </div>
          {selectedUser && (
            <p className="text-green-500 text-sm">✅ {selectedUser.email}</p>
          )}
        </div>

        {/* Columna pokémons */}
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">2. Busca y selecciona pokémons</h2>
            {selectedPokemons.length > 0 && (
              <button
                onClick={() => setSelectedPokemons([])}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Borrar todo ✕
              </button>
            )}
          </div>

          {/* Buscador con sugerencias */}
          <div className="relative">
            <input
              type="text"
              value={pokemonSearch}
              onChange={handlePokemonSearch}
              placeholder="Nombre del pokémon..."
              className="border px-3 py-2 rounded text-sm w-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 bg-white border rounded-lg w-full shadow-lg">
                {suggestions.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => handleSelectSuggestion(s)}
                    className="p-2 hover:bg-gray-50 cursor-pointer capitalize text-sm border-b"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pokémons seleccionados */}
          <div className="border rounded-lg h-48 overflow-y-auto">
            {selectedPokemons.length === 0 ? (
              <p className="text-gray-400 text-sm p-3">Busca y selecciona pokémons...</p>
            ) : (
              selectedPokemons.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 border-b">
                  <img src={p.sprite} alt={p.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <p className="font-medium capitalize text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">#{p.id}</p>
                  </div>
                  <button
                    onClick={() => removePokemon(p.id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedPokemons.length > 0 && (
            <p className="text-green-500 text-sm">✅ {selectedPokemons.length} pokémon(s) listos</p>
          )}
        </div>
      </div>

      <button
        onClick={handleGive}
        disabled={loading || !selectedUser || selectedPokemons.length === 0}
        className="bg-green-500 text-white px-8 py-3 rounded hover:bg-green-600 disabled:opacity-50 w-full"
      >
        {loading ? 'Enviando...' : `Dar ${selectedPokemons.length} pokémon(s) a ${selectedUser?.email || '...'}`}
      </button>
      <button
  onClick={async () => {
    const { ref, remove } = await import('firebase/database')
    const { rtdb } = await import('../firebase')
    await remove(ref(rtdb, 'rooms'))
    showToast('✅ Todas las salas eliminadas')
  }}
  className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600 w-full"
>
  🗑️ Eliminar todas las salas
</button>

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

    </div>
  )

}

export default Admin