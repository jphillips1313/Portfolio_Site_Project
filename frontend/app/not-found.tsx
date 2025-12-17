import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="relative mb-8">
          <h1 className="text-200px sm:text-250px font-bold text-bg-card leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl font-bold text-text-promary">
              迷子
            </span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-accent-red text-text-primary font-medium rounded-lg havoer:bg-accent-red-hover transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/cv"
            className="px-8 py-3 border-2 border-border-visible text-text-primary font-medium rounded-lg hover:border-accent-red hover:text-accent-red transition-colors"
          >
            View CV
          </Link>
        </div>

        <p className="mt-12 text-sm text-text-muted">
          迷子 (maigo) = "lost" in japanese
        </p>
      </div>
    </div>
  );
}
