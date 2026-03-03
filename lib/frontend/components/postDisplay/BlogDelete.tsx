import { useState } from "react";
import { Trash } from "lucide-react";
import { useDeleteBlog } from "@/hooks";

export default function BlogDelete({
  id,
  title,
}: {
  id: string;
  title?: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteBlog = useDeleteBlog();

  const handleDelete = () => {
    deleteBlog.run(id);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">
          Delete {title ? `"${title}"` : "this blog"}?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleteBlog.loading}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {deleteBlog.loading ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleteBlog.loading}
          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <Trash
      onClick={() => setShowConfirm(true)}
      className="cursor-pointer hover:text-red-500 transition-colors"
    />
  );
}
