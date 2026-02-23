import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://jsonplaceholder.typicode.com/posts'

const usePosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

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

  useEffect(() => {
    loadPosts()
  }, [])

  const createPost = async (newPost) => {
    const { data } = await axios.post(API, { ...newPost, userId: 1 })
    setPosts((prev) => [{ ...data, id: Date.now() }, ...prev])
  }

  const updatePost = async ({ id, ...data }) => {
    await axios.put(`${API}/${id}`, data)
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
  }

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
    } catch {
    } finally {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return { posts, isLoading, isError, createPost, updatePost, deletePost, reloadPosts: loadPosts }
}

export default usePosts