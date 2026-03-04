import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  comment: z.string().min(10, 'Minimo 10 caracteres'),
  rating: z.coerce.number().min(1, 'Minimo 1').max(5, 'Maximo 5'),
})

const inputStyle = {
  background: '#1a1a2e',
  color: '#fff',
  border: '3px solid #444',
  padding: '8px 10px',
  width: '100%',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '7px',
  outline: 'none',
}

const labelStyle = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '7px',
  color: '#ffdd00',
  display: 'block',
  marginBottom: '6px',
}

const errorStyle = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '6px',
  color: '#ff6666',
  marginTop: '4px',
}

const PokemonForm = ({ pokemonName, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => {
    console.log('Resena enviada:', data)
    reset()
    onSuccess(`Resena de ${pokemonName.toUpperCase()} enviada`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>

      <div>
        <label style={labelStyle}>TU NOMBRE</label>
        <input {...register('name')} style={inputStyle} placeholder="Ej: Ash Ketchum" />
        {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>COMENTARIO</label>
        <textarea {...register('comment')} style={{ ...inputStyle, resize: 'none' }} placeholder="Que opinas de este pokemon?" rows={3} />
        {errors.comment && <p style={errorStyle}>{errors.comment.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>PUNTUACION (1-5)</label>
        <input {...register('rating')} type="number" style={inputStyle} placeholder="1 al 5" />
        {errors.rating && <p style={errorStyle}>{errors.rating.message}</p>}
      </div>

      <button
        type="submit"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '8px',
          color: '#000',
          background: '#ffdd00',
          border: '4px solid #000',
          boxShadow: '4px 4px 0 #000',
          padding: '10px',
          cursor: 'pointer',
          width: '100%',
        }}
        onMouseDown={e => e.currentTarget.style.boxShadow = '1px 1px 0 #000'}
        onMouseUp={e => e.currentTarget.style.boxShadow = '4px 4px 0 #000'}
      >
        ENVIAR RESENA
      </button>
    </form>
  )
}

export default PokemonForm