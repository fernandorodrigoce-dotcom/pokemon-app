import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Esquema de validacion con Zod
const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  rating: z.coerce.number().min(1, 'Mínimo 1').max(5, 'Máximo 5'),
})

const PokemonForm = ({ pokemonName }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log('Reseña enviada:', data)
    alert(`Reseña de ${pokemonName} enviada correctamente ✅`)
    reset()
  }

  return (
    <div className="mt-6 border rounded-lg p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Dejar una reseña</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="block mb-1 font-medium">Tu nombre</label>
          <input
            {...register('name')}
            className="border px-3 py-2 rounded w-full"
            placeholder="Ej: Ash Ketchum"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Comentario */}
        <div>
          <label className="block mb-1 font-medium">Comentario</label>
          <textarea
            {...register('comment')}
            className="border px-3 py-2 rounded w-full"
            placeholder="¿Qué opinas de este pokémon?"
            rows={3}
          />
          {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 font-medium">Puntuación (1-5)</label>
          <input
            {...register('rating')}
            type="number"
            className="border px-3 py-2 rounded w-full"
            placeholder="1 al 5"
          />
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar reseña
        </button>
      </form>
    </div>
  )
}

export default PokemonForm