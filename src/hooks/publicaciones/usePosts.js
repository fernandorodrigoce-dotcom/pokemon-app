import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://jsonplaceholder.typicode.com/posts'

const usePosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // localPosts = posts creados por el usuario (solo viven en memoria/estado)
  const [localPosts, setLocalPosts] = useState([])

  const loadPosts = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const { data } = await axios.get(API)
      setPosts(data.slice(0, 20))
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  // Crear: guarda localmente con flag isLocal=true
  const createPost = async (newPost) => {
    const { data } = await axios.post(API, { ...newPost, userId: 1 })
    const localPost = { ...data, id: Date.now(), isLocal: true, title: newPost.title, body: newPost.body }
    setLocalPosts(prev => [localPost, ...prev])
  }

  // Actualizar: si es local solo actualiza en estado, si es de API hace PUT
  const updatePost = async ({ id, ...data }) => {
    const isLocal = localPosts.find(p => p.id === id)
    if (isLocal) {
      setLocalPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    } else {
      await axios.put(API + '/' + id, data)
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }
  }

  // Eliminar: busca en local primero, luego en API
  const deletePost = async (id) => {
    const isLocal = localPosts.find(p => p.id === id)
    if (isLocal) {
      setLocalPosts(prev => prev.filter(p => p.id !== id))
    } else {
      try { await axios.delete(API + '/' + id) } catch {}
      setPosts(prev => prev.filter(p => p.id !== id))
    }
  }

  // Combinar: locales primero, luego API
  const allPosts = [...localPosts, ...posts]

  return { posts: allPosts, isLoading, isError, createPost, updatePost, deletePost, reloadPosts: loadPosts }
}

export default usePosts