import { useDeleteSession } from "@/hooks/session.hooks";
import { Trash } from "lucide-react";

export default function SessionDelete({ sessionId, onClick }: {
  sessionId: string;
  onClick?: () => void;
}) {
  const { mutate: deleteSession } = useDeleteSession();

  const handleDelete = () => {
    deleteSession(sessionId, {
      onSuccess: () => {
        if (onClick) onClick();
      },
    });
  };

  return (
    <button
      className="text-red-500 hover:text-red-700 cursor-pointer"
      onClick={handleDelete}
      title="Delete Session"
    >
      <Trash className="h-4 w-4" />
    </button>
  );

}