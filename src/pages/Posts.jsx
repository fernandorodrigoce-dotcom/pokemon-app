import { useState } from 'react'
import usePosts from '../hooks/publicaciones/usePosts'
import PostCard from '../components/posts/PostCard'
import PostForm from '../components/posts/PostForm'
import Toast from '../components/funcionespagina/Toast'

const font = "'Press Start 2P', cursive"

const Posts = () => {
  const { posts, isLoading, isError, createPost, updatePost, deletePost, reloadPosts } = usePosts()
  const [editingPost, setEditingPost] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleCreate = async (data) => {
    try { await createPost(data); showToast('POST CREADO') }
    catch { showToast('ERROR AL CREAR', 'error') }
  }

  const handleUpdate = async (data) => {
    try { await updatePost({ id: editingPost.id, ...data }); showToast('POST ACTUALIZADO'); setEditingPost(null) }
    catch { showToast('ERROR AL ACTUALIZAR', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deletePost(id); showToast('POST ELIMINADO') }
    catch { showToast('ERROR AL ELIMINAR', 'error') }
  }

  if (isLoading) return (
    <div style={{ minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <p style={{ fontFamily:font,color:'#ffdd00',fontSize:'14px' }}>CARGANDO POSTS...</p>
    </div>
  )

  if (isError) return (
    <div style={{ minHeight:'100vh',background:'#1a1a2e',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px' }}>
      <p style={{ fontFamily:font,color:'#ff6666',fontSize:'11px' }}>ERROR AL CARGAR</p>
      <button onClick={reloadPosts} style={{ fontFamily:font,fontSize:'10px',background:'#cc0000',color:'#fff',border:'4px solid #000',boxShadow:'4px 4px 0 #000',padding:'14px 28px',cursor:'pointer' }}>REINTENTAR</button>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#1a1a2e',padding:'32px',boxSizing:'border-box' }}>
      <div style={{ maxWidth:'760px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'24px' }}>

        <p style={{ fontFamily:font,fontSize:'18px',color:'#ffdd00' }}>★ POSTS ★</p>

        <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid '+(editingPost?'#ffdd00':'#444'),boxShadow:'4px 4px 0 #000',padding:'24px',display:'flex',flexDirection:'column',gap:'16px' }}>
          <p style={{ fontFamily:font,fontSize:'9px',color:editingPost?'#ffdd00':'#aaa' }}>{editingPost?'EDITANDO POST':'NUEVO POST'}</p>
          <PostForm
            key={editingPost?editingPost.id:'new'}
            onSubmit={editingPost?handleUpdate:handleCreate}
            defaultValues={editingPost||{}}
            buttonText={editingPost?'GUARDAR CAMBIOS':'CREAR POST'}
          />
          {editingPost && (
            <button onClick={()=>setEditingPost(null)}
              style={{ fontFamily:font,fontSize:'7px',color:'#aaa',background:'none',border:'none',cursor:'pointer',textDecoration:'underline' }}
            >CANCELAR EDICION</button>
          )}
        </div>

        {posts.length === 0 ? (
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',padding:'40px' }}>
            <p style={{ fontFamily:font,fontSize:'9px',color:'#555' }}>NO HAY POSTS</p>
            <button onClick={reloadPosts} style={{ fontFamily:font,fontSize:'9px',background:'#4444cc',color:'#fff',border:'4px solid #000',boxShadow:'4px 4px 0 #000',padding:'14px 28px',cursor:'pointer' }}>RECARGAR</button>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} onEdit={setEditingPost} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}

export default Posts