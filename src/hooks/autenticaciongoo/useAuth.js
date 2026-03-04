import { useState, useEffect } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, provider, db } from '../../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      // Guardar correo en Firestore cuando inicia sesión
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          await setDoc(docRef, { email: currentUser.email }, { merge: true })
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, loginWithGoogle, logout }
}

export default useAuth