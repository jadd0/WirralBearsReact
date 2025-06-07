import { useGetFullSchedule } from '@/hooks/session.hooks';
import SessionGrid from '@/components/sessions/display/SessionGrid';
import SessionGridSkeleton from '@/components/sessions/display/SessionGridSkeleton';
import { FullSessionSchedule } from '@wirralbears/backend-types';
import { LogoBanner } from '@/components/layout/LogoBanner';

export default function SessionsPage() {
	const { data: schedule, isLoading, isError } = useGetFullSchedule();
	const scheduleTyped = schedule as FullSessionSchedule;

	console.log(scheduleTyped);

	return (
		<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <LogoBanner />
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Training Sessions Schedule
					</h1>
					<p className="text-lg text-gray-600">
						View our weekly training sessions and coaches
					</p>
					<p className="text-md text-gray-600">
						Updated on{' '}
						{new Date(
							scheduleTyped?.sessionDays[0].updatedAt
						).toLocaleDateString()}
					</p>
				</div>

				{isLoading && <SessionGridSkeleton />}

				{!isLoading && !isError && scheduleTyped && (
					<SessionGrid schedule={scheduleTyped} />
				)}

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Schedule subject to change based on weather and coach availability
					</p>
					<p className="mt-2">Contact coaches for any special requirements</p>
				</div>
			</div>
		</div>
	);
}
