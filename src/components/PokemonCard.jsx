// Tarjeta de cada pokemon
const PokemonCard = ({ pokemon }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-lg transition">
      {/* Imagen */}
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="w-24 h-24"
      />
      {/* Numero y nombre */}
      <p className="font-bold capitalize">
        #{pokemon.id} {pokemon.name}
      </p>
      {/* Tipos */}
      <div className="flex gap-1">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="bg-gray-200 text-xs px-2 py-1 rounded capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
      {/* Boton desbloquear */}
      <button className="mt-2 bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600">
        Desbloquear
      </button>
    </div>
  )
}

export default PokemonCard
