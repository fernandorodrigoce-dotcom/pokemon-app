// Componente de paginación
const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        ← Anterior
      </button>

      <span className="font-bold">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente →
      </button>
    </div>
  )
}

export default Pagination