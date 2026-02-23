import { useQuery } from '@tanstack/react-query'

const ITEMS_PER_PAGE = 20

const fetchPokemons = async (page) => {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
  const data = await res.json()

  const details = await Promise.all(
    data.results.map((p) => fetch(p.url).then((r) => r.json()))
  )

  // Delay artificial de 2 segundos
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    pokemons: details,
    total: data.count,
    totalPages: Math.ceil(data.count / ITEMS_PER_PAGE),
  }
}

const usePokemon = (page = 1) => {
  return useQuery({
    queryKey: ['pokemons', page],
    queryFn: () => fetchPokemons(page),
  })
}

export default usePokemon