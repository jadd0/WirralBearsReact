import { Link } from "react-router-dom";

export function LogoBanner({ className = "" }) {
  return (
    <Link to="/" className="flex justify-center my-4">
      <img
        src="/images/bears b star1.png"
        className={`bear ${className}`}
        alt="Wirral Bears Logo"
      />
    </Link>
  );
}
