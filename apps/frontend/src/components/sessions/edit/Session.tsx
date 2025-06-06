import { Session } from "@wirralbears/backend-types";
import SessionDelete from "./SessionDelete";
import { SessionDropdown } from "./SessionDropdown";

export default function SessionComponent({session, onDelete }: {session: Session; onDelete: () => void}) {
  return (

    <div className="flex flex row">
      <SessionDropdown />

      <div className="flex-none">
        <SessionDelete sessionId={session.id} onClick={onDelete} />
      </div>
    </div>
  )
}