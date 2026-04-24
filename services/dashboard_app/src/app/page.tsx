"use client";

import AuthGuard from "@/components/AuthGuard";
import { clearToken } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

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
