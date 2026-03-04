import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const font = "'Press Start 2P', cursive"

const schema = z.object({
  title: z.string().min(5, 'MINIMO 5 CARACTERES'),
  body: z.string().min(10, 'MINIMO 10 CARACTERES'),
})

const inputStyle = { width:'100%',background:'#0d0d1a',color:'#ffdd00',fontFamily:font,fontSize:'8px',padding:'12px',border:'3px solid #444',outline:'none',boxSizing:'border-box',lineHeight:1.8 }

const PostForm = ({ onSubmit, defaultValues={}, buttonText='CREAR POST' }) => {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm({ resolver:zodResolver(schema),defaultValues })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])
  const handleFormSubmit = (data) => { onSubmit(data); reset() }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
      <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
        <label style={{ fontFamily:font,fontSize:'7px',color:'#aaa' }}>TITULO</label>
        <input {...register('title')} placeholder='TITULO DEL POST...' style={inputStyle} />
        {errors.title && <p style={{ fontFamily:font,fontSize:'6px',color:'#ff6666' }}>{errors.title.message}</p>}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
        <label style={{ fontFamily:font,fontSize:'7px',color:'#aaa' }}>CONTENIDO</label>
        <textarea {...register('body')} placeholder='CONTENIDO...' rows={4} style={{ ...inputStyle,resize:'vertical' }} />
        {errors.body && <p style={{ fontFamily:font,fontSize:'6px',color:'#ff6666' }}>{errors.body.message}</p>}
      </div>
      <button type='submit'
        style={{ fontFamily:font,fontSize:'10px',background:'#cc0000',color:'#fff',border:'4px solid #000',boxShadow:'4px 4px 0 #000',padding:'16px',cursor:'pointer' }}
        onMouseDown={e=>e.currentTarget.style.boxShadow='1px 1px 0 #000'}
        onMouseUp={e=>e.currentTarget.style.boxShadow='4px 4px 0 #000'}
      >{buttonText}</button>
    </form>
  )
}

export default PostForm