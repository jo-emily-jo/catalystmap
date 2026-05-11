export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 animate-pulse">
      <div className="h-4 w-20 rounded bg-gray-100" />
      <div className="mt-6 h-7 w-48 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
      <div className="mt-4 h-32 w-full rounded bg-gray-100" />

      <div className="mt-8 h-5 w-48 rounded bg-gray-100" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-10 w-full rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
