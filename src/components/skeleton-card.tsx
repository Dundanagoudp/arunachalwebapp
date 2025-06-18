export function SkeletonCard() {
  return (
    <div className="flex flex-col items-center">
      <div className="overflow-hidden rounded-lg w-64 h-80 shadow-md bg-gray-200 animate-pulse">
        {/* Placeholder for image */}
      </div>
      <div className="mt-4 w-3/4 h-6 bg-gray-200 rounded animate-pulse">{/* Placeholder for text */}</div>
    </div>
  )
}
