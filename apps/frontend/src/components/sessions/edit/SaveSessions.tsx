

export default function SaveSessions({onClick, onSuccess}: {onClick: () => void, onSuccess: () => void}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
      <button
        onClick={() => {
          onClick();
          onSuccess();
        }}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save Sessions
      </button>
    </div>
  );

}