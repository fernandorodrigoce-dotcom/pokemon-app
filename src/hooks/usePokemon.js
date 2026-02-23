import { useQuery } from '@tanstack/react-query'

// Función que trae la lista de pokémons con delay de 2 segundos
const fetchPokemons = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  const data = await res.json()

  // Traemos el detalle de cada pokemon (imagen, tipos, stats)
  const details = await Promise.all(
    data.results.map((p) => fetch(p.url).then((r) => r.json()))
  )

  // Delay artificial de 2 segundos para ver el skeleton
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return details
}

// Hook personalizado
const usePokemon = () => {
  return useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
  })
}

export default usePokemon