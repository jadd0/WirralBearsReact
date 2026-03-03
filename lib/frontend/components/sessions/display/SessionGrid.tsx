import { FullSessionSchedule } from "@/shared/types";

import SessionDay from "./SessionDay";
import { useCoachPreviews } from "@/lib/frontend/hooks";

export default function SessionGrid({
  schedule,
}: {
  schedule?: FullSessionSchedule;
}) {
  const { data, loading, error } = useCoachPreviews();

  if (!schedule?.sessionDays?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {!loading &&
        schedule.sessionDays.map((sessionDay) => (
          <SessionDay
            key={sessionDay.id}
            sessionDay={sessionDay}
            coaches={data || []}
          />
        ))}
    </div>
  );
}
