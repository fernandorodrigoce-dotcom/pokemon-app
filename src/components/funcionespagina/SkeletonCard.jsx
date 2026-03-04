const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center gap-2 animate-pulse">
      <div className="bg-gray-300 w-24 h-24 rounded-full"></div>
      <div className="bg-gray-300 h-4 w-20 rounded"></div>
      <div className="bg-gray-300 h-3 w-16 rounded"></div>
    </div>
  )
}

export default SkeletonCard