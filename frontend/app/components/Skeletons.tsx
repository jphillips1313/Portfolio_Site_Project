// app/components/Skeleton.tsx

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-bg-secondary/50 rounded ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(138, 74, 94, 0.1), transparent)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

// Education-specific skeleton
export function EducationCardSkeleton() {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
      {/* Header area */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Degree name */}
          <Skeleton className="h-6 w-3/4 mb-2" />
          {/* Institution */}
          <Skeleton className="h-4 w-1/2 mb-2" />
          {/* Date range */}
          <Skeleton className="h-3 w-1/3" />
        </div>
        {/* Grade badge */}
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
