"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { getProfile } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setVisible(false);
      return;
    }
    getProfile(token)
      .then((p) => {
        setDisplayName(p.name || p.username || "User");
        setIsAdmin(p.role === "ADMIN");
        setVisible(true);
      })
      .catch(() => setVisible(false));
  }, [pathname]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (!visible) return null;

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">Platform</Link>
      <div className="navbar-links">
        <Link href="/" className={`navbar-link${pathname === "/" ? " navbar-link-active" : ""}`}>
          Home
        </Link>
        <Link href="/account" className={`navbar-link${pathname === "/account" ? " navbar-link-active" : ""}`}>
          My Account
        </Link>
        {isAdmin && (
          <Link href="/admin" className={`navbar-link${pathname === "/admin" ? " navbar-link-active" : ""}`}>
            Admin
          </Link>
        )}
      </div>
      <div className="navbar-user">
        <span className="navbar-greeting">{displayName}</span>
        <button className="navbar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
