import { useQuery } from '@tanstack/react-query'

const ITEMS_PER_PAGE = 20

const fetchPokemons = async (page) => {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
  const data = await res.json()

  const details = await Promise.all(
    data.results.map((p) => fetch(p.url).then((r) => r.json()))
  )

  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    pokemons: details,
    total: data.count,
    totalPages: Math.ceil(data.count / ITEMS_PER_PAGE),
  }
}

const fetchAllPokemonNames = async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
  const data = await res.json()
  return data.results
}

const fetchPokemonByName = async (name) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) return null
  return res.json()
}

const usePokemon = (page = 1) => {
  return useQuery({
    queryKey: ['pokemons', page],
    queryFn: () => fetchPokemons(page),
  })
}

export const useSearchPokemon = (search) => {
  return useQuery({
    queryKey: ['search', search],
    queryFn: async () => {
      if (!search) return []
      const allNames = await fetchAllPokemonNames()
      const matches = allNames.filter((p) => p.name.includes(search.toLowerCase()))
      const details = await Promise.all(matches.map((p) => fetchPokemonByName(p.name)))
      return details.filter(Boolean)
    },
    enabled: search.length > 0,
  })
}

export default usePokemon