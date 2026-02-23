const PokemonCard = ({ pokemon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="w-24 h-24"
      />
      <p className="font-bold capitalize">
        #{pokemon.id} {pokemon.name}
      </p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="bg-gray-200 text-xs px-2 py-1 rounded capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
      <button
        onClick={(e) => e.stopPropagation()}
        className="mt-2 bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600"
      >
        Desbloquear
      </button>
    </div>
  )
}

export default PokemonCard