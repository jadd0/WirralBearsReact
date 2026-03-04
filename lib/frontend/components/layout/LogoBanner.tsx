import Link from "next/link";
import Image from "next/image";

export function LogoBanner({ className = "" }) {
  return (
    <div className="w-screen flex justify-center mb-10">
      {/* <Link href="/" className=" my-4 max-w-150">
        <Image
          src={"/images/WirralBearsBanner.png"}
          className={`bear ${className}`}
          alt="Wirral Bears Logo"
          fill
          style={{ objectFit: "cover" }}
        />
      </Link> */}
    </div>
  );
}
