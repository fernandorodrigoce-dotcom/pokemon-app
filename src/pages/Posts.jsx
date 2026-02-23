import { useState } from 'react'
import usePosts from '../hooks/usePosts'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import Toast from '../components/Toast'

const Posts = () => {
  const { posts, isLoading, isError, createPost, updatePost, deletePost, reloadPosts } = usePosts()
  const [editingPost, setEditingPost] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleCreate = async (data) => {
    try {
      await createPost(data)
      showToast('Post creado correctamente ✅')
    } catch {
      showToast('Error al crear el post', 'error')
    }
  }

  const handleUpdate = async (data) => {
    try {
      await updatePost({ id: editingPost.id, ...data })
      showToast('Post actualizado correctamente ✅')
      setEditingPost(null)
    } catch {
      showToast('Error al actualizar el post', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePost(id)
      showToast('Post eliminado correctamente 🗑️')
    } catch {
      showToast('Error al eliminar el post', 'error')
    }
  }

  if (isLoading) return <p className="p-6">Cargando posts...</p>
  if (isError) return <p className="p-6">Error al cargar los posts</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>

      {/* Formulario crear o editar */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-bold text-lg mb-4">
          {editingPost ? 'Editar post' : 'Crear nuevo post'}
        </h2>
        <PostForm
          key={editingPost ? editingPost.id : 'new'}
          onSubmit={editingPost ? handleUpdate : handleCreate}
          defaultValues={editingPost || {}}
          buttonText={editingPost ? 'Guardar cambios' : 'Crear post'}
        />
        {editingPost && (
          <button
            onClick={() => setEditingPost(null)}
            className="mt-2 text-sm text-gray-500 hover:underline"
          >
            Cancelar edición
          </button>
        )}
      </div>

      {/* Lista de posts o boton recargar */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 mt-10">
          <p className="text-gray-500">No hay posts disponibles</p>
          <button
            onClick={reloadPosts}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Recargar posts
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={setEditingPost}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Toast notificacion */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Posts