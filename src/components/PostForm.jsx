import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const schema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  body: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
})

const PostForm = ({ onSubmit, defaultValues = {}, buttonText = 'Crear post' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // Actualiza el formulario cuando cambia el post a editar
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block mb-1 font-medium">Título</label>
        <input
          {...register('title')}
          className="border px-3 py-2 rounded w-full"
          placeholder="Título del post"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Contenido</label>
        <textarea
          {...register('body')}
          className="border px-3 py-2 rounded w-full"
          placeholder="Contenido del post"
          rows={3}
        />
        {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </form>
  )
}

export default PostForm