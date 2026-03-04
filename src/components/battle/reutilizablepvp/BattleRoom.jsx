import useBattle from '../../../hooks/batalla/useBattle'

const HPBar = ({ current, max }) => {
  const percent = Math.max(0, (current / max) * 100)
  const color = percent > 50 ? 'bg-green-500' : percent > 20 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`${color} h-3 rounded-full transition-all`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

const BattleRoom = ({ myPokemon, rivalPokemon, mySelectedMoves, onFinish }) => {
  const {
    myHP, rivalHP, myMaxHP, rivalMaxHP,
    myMoves, log, isMyTurn, battleOver, winner, loading, attack
  } = useBattle(myPokemon, rivalPokemon, mySelectedMoves)

  if (loading) return <p className="text-center p-4">Cargando batalla...</p>

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-2xl mx-auto">

      <div className="flex justify-between w-full gap-4">
        {/* Rival */}
        <div className="flex flex-col items-center gap-1 w-1/2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Rival</p>
          <p className="font-bold capitalize">{rivalPokemon.name}</p>
          <p className="text-sm text-gray-500">{rivalHP} / {rivalMaxHP} HP</p>
          <HPBar current={rivalHP} max={rivalMaxHP} />
          <img src={rivalPokemon.sprites.front_default} alt={rivalPokemon.name} className="w-24 h-24" />
        </div>

        {/* Yo */}
        <div className="flex flex-col items-center gap-1 w-1/2">
          <p className="text-xs text-blue-400 uppercase tracking-wide">Tú</p>
          <p className="font-bold capitalize">{myPokemon.name}</p>
          <p className="text-sm text-gray-500">{myHP} / {myMaxHP} HP</p>
          <HPBar current={myHP} max={myMaxHP} />
          <img src={myPokemon.sprites.back_default} alt={myPokemon.name} className="w-24 h-24" />
        </div>
      </div>

      {battleOver && (
        <div className="text-center">
          <p className="text-2xl font-bold">
            {winner === 'me' ? '🏆 ¡Ganaste!' : '💀 ¡Perdiste!'}
          </p>
          <button
            onClick={onFinish}
            className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Volver
          </button>
        </div>
      )}

      {!battleOver && (
        <>
          <div className="w-full">
            <p className="text-sm font-bold mb-2 capitalize">
              Movimientos de {myPokemon.name}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {myMoves.map((move) => (
                <button
                  key={move.id}
                  onClick={() => attack(move)}
                  disabled={!isMyTurn}
                  className="border rounded-lg p-3 text-left hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <p className="font-bold capitalize">{move.name}</p>
                  <p className="text-xs text-gray-500">
                    Poder: {move.power} | Tipo: {move.type.name} | Precisión: {move.accuracy}%
                  </p>
                </button>
              ))}
            </div>
          </div>

          {!isMyTurn && (
            <p className="text-gray-500 animate-pulse">Turno del rival...</p>
          )}
        </>
      )}

      <div className="w-full border rounded-lg p-3 h-32 overflow-y-auto bg-gray-50">
        {log.map((msg, i) => (
          <p key={i} className="text-sm">{msg}</p>
        ))}
      </div>

    </div>
  )
}

export default BattleRoom