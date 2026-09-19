"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 2.02-6 4.5V20h12v-1.5C18 16.02 15.31 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={`topnav ${isHome ? "transparent" : ""}`}>
      <Link href="/" className="brand-logo-link" aria-label="Go to home">
        <Image
          src={isHome ? "/assets/white_logo.png" : "/assets/logo.png"}
          alt="Uplern"
          className="brand-logo"
          width={130}
          height={34}
          priority
        />
      </Link>

      <nav className="nav-links">
        <Link className="icon-btn" href="/login" aria-label="Admin login">
          <AdminIcon />
        </Link>
      </nav>
    </header>
  );
}
