'use client';

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-paper-2 animate-pulse rounded ${className}`}></div>
  );
}

export default function SessionDaySkeleton() {
  return (
    <div className="bg-paper rounded-xl p-6 flex flex-col gap-4">
      <Skeleton className="h-7 w-1/2 mb-2" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}