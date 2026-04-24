"use client";

import AuthGuard from "@/components/AuthGuard";
import { clearToken, getToken } from "@/lib/auth";
import { getProfile } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getProfile(token)
      .then((p) => setIsAdmin(p.role === "ADMIN"))
      .catch(() => {});
  }, []);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <AuthGuard>
      <div className="page-center">
        <div className="card" style={{ textAlign: "center" }}>
          <h1>Hello World</h1>
          <div className="link-row">
            <Link href="/account">My Account</Link>
          </div>
          {isAdmin && (
            <div className="link-row">
              <Link href="/admin">Admin Dashboard</Link>
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ marginTop: "1.5rem" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
