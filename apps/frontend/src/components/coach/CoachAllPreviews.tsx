import { CoachPreview } from '../../../../backend/src/types/coach.types';
import CoachPreviewElement from './CoachPreviewElement';
import CoachPreviewSkeleton from './CoachPreviewSkeleton';

export default function CoachAllPreviews({
  coaches,
  isLoading,
}: {
  coaches: CoachPreview[];
  isLoading: boolean;
}) {
  return (
    <section className="w-full max-w-4xl mx-auto px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 py-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CoachPreviewSkeleton key={`skeleton-${index}`} />
          ))
        ) : coaches.length > 0 ? (
          coaches.map((coach) => (
            <CoachPreviewElement key={coach.id} coach={coach} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center min-w-[250px] py-16">
            <div className="w-16 h-16 mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No coaches found
            </h3>
            <p className="text-gray-500">Check back later for new content!</p>
          </div>
        )}
      </div>
    </section>
  );
}
