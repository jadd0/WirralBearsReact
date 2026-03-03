import { useState, useEffect } from "react";
import SessionComponent from "./Session";
import { SessionDayWithSessions } from "@/shared/types";
import { SessionSelect } from "@/shared/types";

export default function SessionDayComponent({
  sessionDay,
  onSessionsChange,
}: {
  sessionDay: SessionDayWithSessions;
  onSessionsChange: (newSessions: SessionSelect[]) => void;
}) {
  const [sessions, setSessions] = useState<SessionSelect[]>(
    sessionDay?.sessions ?? [],
  );

  useEffect(() => {
    onSessionsChange(sessions);
  }, [sessions]);

  const handleEditSession = (updatedSession: SessionSelect) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const addNewSession = () => {
    setSessions((prev) => [
      ...prev,
      {
        id: `new-${sessions.length}`,
        day: sessionDay!.id,
        time: "",
        age: 5,
        gender: "Mixed",
        leadCoach: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {sessionDay.day}
        </h2>
        <button
          onClick={addNewSession}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
        >
          + Add Session
        </button>
      </div>
      <ul className="space-y-3">
        {sessions.map((session) => (
          <SessionComponent
            key={session.id}
            session={session}
            onDelete={() => handleDeleteSession(session.id)}
            onEdit={handleEditSession}
          />
        ))}
      </ul>
    </div>
  );
}
