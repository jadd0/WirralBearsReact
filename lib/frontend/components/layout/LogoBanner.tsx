import Link from "next/link";
import Image from "next/image";

export function LogoBanner({ className = "" }) {
  return (
    <div className="w-full flex justify-center mb-10">
      <Link href="/" className=" my-4 max-w-150">
        <img
          src="/images/WirralBearsBanner.png"
          alt="Wirral Bears Logo"
          className={className}
          style={{ objectFit: "cover" }}
        />
      </Link>
    </div>
  );
}
