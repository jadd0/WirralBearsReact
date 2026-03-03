import Link from "next/link";
import WirralBearsLogo from "@assets/images/WirralBearsBanner.png";
import Image from "next/image";

export function LogoBanner({ className = "" }) {
  return (
    <div className="w-full flex justify-center mb-10">
      <Link href="/" className=" my-4 max-w-150">
        <Image src={WirralBearsLogo} className={`bear ${className}`} alt="Wirral Bears Logo" />
      </Link>
    </div>
  );
}
