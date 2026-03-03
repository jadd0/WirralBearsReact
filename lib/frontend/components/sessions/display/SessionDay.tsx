import { CoachPreview } from "@/lib/db/repo";
import { SessionDay } from "@/shared/types";
import { TrainingSessionWithCoach } from "@/lib/db/schemas";
import SessionItem from "./SessionItem";

export default function SessionDayComponent({
  sessionDay,
  coaches,
}: {
  sessionDay: SessionDay & { sessions: TrainingSessionWithCoach[] };
  coaches?: CoachPreview[] | null;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 pb-2">
        {sessionDay.day}
      </h2>
      <div className="space-y-3">
        {sessionDay.sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No sessions scheduled this day
          </p>
        ) : (
          sessionDay.sessions.map((session) => {
            // Find the matching coach
            const coach = coaches?.find((c) => c.id === session.leadCoach);
            return (
              <SessionItem
                key={session.id}
                session={session}
                coach={coach || "Coach TBA"}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
