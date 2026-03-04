import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'

const useUnlocked = () => {
  const [user, setUser] = useState(null)
  const [unlocked, setUnlocked] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUnlocked(docSnap.data().unlocked || [])
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const unlockPokemon = async (pokemon) => {
    if (!user) return
    const docRef = doc(db, 'users', user.uid)
    const newPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name),
    }
    await updateDoc(docRef, {
      unlocked: arrayUnion(newPokemon),
    })
    setUnlocked((prev) => [...prev, newPokemon])
  }

  return { user, unlocked, unlockPokemon }
}

export default useUnlocked