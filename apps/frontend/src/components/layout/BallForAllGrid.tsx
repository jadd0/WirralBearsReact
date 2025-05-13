const policies = [
  { img: "AZ4A4121.jpg", title: "Joy" },
  { img: "logan block.jpg", title: "Positivity" },
  { img: "Respect.jpg", title: "Respect" },
  { img: "AZ4A3475.jpg", title: "Equality" },
  { img: "Dedication.jpg", title: "Dedication and Effort" },
  { img: "Growth.jpg", title: "Growth" },
  { img: "DSC00376a.jpg", title: "Pass" },
  { img: "Defence.jpg", title: "Defence" },
  { img: "Shoot.jpg", title: "Shoot" },
  { img: "21B4377B-B274-40FC-A729-47687A0DB9CE.JPG", title: "Play" },
];

export function BallForAllGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-6">
      {policies.map((policy) => (
        <div key={policy.title} className="flex flex-col items-center bg-white rounded shadow p-2">
          <img
            src={`/images/${policy.img}`}
            alt={policy.title}
            className="object-cover h-24 w-24 rounded mb-2"
          />
          <p className="font-semibold">{policy.title}</p>
        </div>
      ))}
    </div>
  );
}
