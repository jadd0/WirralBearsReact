import { Link } from "react-router-dom";
import WirralBearsLogo from '@assets/images/WirralBearsBanner.png';

export function LogoBanner({ className = "" }) {
  return (
    <div className="w-full flex justify-center mb-10">
          <Link to="/" className=" my-4 max-w-150">
      <img
        src={WirralBearsLogo}
        className={`bear ${className}`}
      />
    </Link>
    </div>

  );
}
