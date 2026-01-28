'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
      <div
        className="text-center"
        style={{
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        <h1 className="mb-4 text-5xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md mx-auto text-lg text-slate-400">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-full border border-slate-600 px-8 py-3 font-semibold text-slate-300 transition-colors hover:border-slate-400 hover:text-white"
          >
            Go Home
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
