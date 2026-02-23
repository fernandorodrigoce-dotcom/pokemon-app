// Tarjeta de cada post con opciones de editar y eliminar
const PostCard = ({ post, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="font-bold capitalize">{post.title}</h3>
      <p className="text-gray-600 text-sm">{post.body}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(post)}
          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default PostCard