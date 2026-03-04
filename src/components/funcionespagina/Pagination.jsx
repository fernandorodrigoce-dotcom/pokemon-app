const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="bg-white text-black text-xs px-4 py-3 pixel-border hover:bg-red-500 hover:text-white disabled:opacity-30 transition-colors"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        &lt; ANTERIOR
      </button>

      <span className="text-green-400 text-xs">
        {currentPage}/{totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="bg-white text-black text-xs px-4 py-3 pixel-border hover:bg-red-500 hover:text-white disabled:opacity-30 transition-colors"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        SIGUIENTE &gt;
      </button>
    </div>
  )
}

export default Pagination