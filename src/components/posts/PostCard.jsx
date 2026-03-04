const font = "'Press Start 2P', cursive"

const PostCard = ({ post, onEdit, onDelete }) => (
  <div style={{ background:'rgba(0,0,0,0.4)',border:'3px solid '+(post.isLocal?'#4ade80':'#444'),boxShadow:'4px 4px 0 #000',padding:'20px',display:'flex',flexDirection:'column',gap:'12px' }}>
    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px' }}>
      <p style={{ fontFamily:font,fontSize:'9px',color:'#fff',textTransform:'capitalize',lineHeight:1.8,flex:1 }}>{post.title}</p>
      {post.isLocal && <span style={{ fontFamily:font,fontSize:'6px',color:'#4ade80',background:'rgba(74,222,128,0.15)',border:'2px solid #4ade80',padding:'4px 8px',whiteSpace:'nowrap' }}>TU POST</span>}
    </div>
    <p style={{ fontFamily:font,fontSize:'7px',color:'#aaa',lineHeight:2 }}>{post.body}</p>
    <div style={{ display:'flex',gap:'10px',marginTop:'4px' }}>
      <button onClick={()=>onEdit(post)}
        style={{ fontFamily:font,fontSize:'7px',background:'#ffdd00',color:'#000',border:'3px solid #000',boxShadow:'3px 3px 0 #000',padding:'8px 16px',cursor:'pointer' }}
        onMouseDown={e=>e.currentTarget.style.boxShadow='1px 1px 0 #000'}
        onMouseUp={e=>e.currentTarget.style.boxShadow='3px 3px 0 #000'}
      >EDITAR</button>
      <button onClick={()=>onDelete(post.id)}
        style={{ fontFamily:font,fontSize:'7px',background:'#cc0000',color:'#fff',border:'3px solid #000',boxShadow:'3px 3px 0 #000',padding:'8px 16px',cursor:'pointer' }}
        onMouseDown={e=>e.currentTarget.style.boxShadow='1px 1px 0 #000'}
        onMouseUp={e=>e.currentTarget.style.boxShadow='3px 3px 0 #000'}
      >ELIMINAR</button>
    </div>
  </div>
)

export default PostCard