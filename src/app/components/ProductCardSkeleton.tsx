export default function ProductCardSkeleton() {
  return (
    <div className="rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-58 bg-gray-300 " />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300  rounded w-3/4" />
        <div className="h-4 bg-gray-300  rounded w-1/2" />
        <div className="h-4 bg-gray-300  rounded w-1/3" />
        <div className="h-10 bg-gray-300  rounded-lg" />
      </div>
    </div>
  );
}
