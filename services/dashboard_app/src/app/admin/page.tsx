"use client";

import AuthGuard from "@/components/AuthGuard";
import { getToken, clearToken } from "@/lib/auth";
import { getProfile, getAdminUsers, AdminUsersResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const SEX_COLORS: Record<string, string> = {
  male: "#6366f1",
  female: "#ec4899",
  other: "#f59e0b",
  preferNotToSay: "#6b7280",
};

const SEX_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  preferNotToSay: "Prefer not to say",
};

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getProfile(token)
      .then((profile) => {
        if (profile.role !== "ADMIN") {
          router.replace("/");
          return Promise.reject(new Error("not-admin"));
        }
        return getAdminUsers(token);
      })
      .then((adminData) => {
        setData(adminData);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (e.message !== "not-admin") {
          setError(e.message);
          setLoading(false);
        }
      });
  }, [router]);

  const pieData = data
    ? Object.entries(data.genderBreakdown)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: SEX_LABELS[key] ?? key,
          value,
          key,
        }))
    : [];

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <AuthGuard>
      <div className="admin-page">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <button
              className="btn admin-btn-sm"
              style={{ background: "#e5e7eb", color: "#111" }}
              onClick={() => router.push("/")}
            >
              Home
            </button>
            <button
              className="btn btn-primary admin-btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {loading && <p style={{ textAlign: "center", padding: "2rem" }}>Loading…</p>}
        {error && <p className="error-msg" style={{ padding: "1rem" }}>{error}</p>}

        {!loading && !error && data && (
          <div className="admin-content">
            <div className="card admin-card">
              <h2 className="admin-section-title">Users ({data.users.length})</h2>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Sex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user.id}>
                        <td className="admin-table-id">{user.id}</td>
                        <td>{user.username}</td>
                        <td>
                          <span className={user.role === "ADMIN" ? "admin-badge admin-badge-admin" : "admin-badge admin-badge-player"}>
                            {user.role}
                          </span>
                        </td>
                        <td>{SEX_LABELS[user.sex] ?? user.sex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card admin-card">
              <h2 className="admin-section-title">Sex Distribution</h2>
              <div className="admin-chart-wrapper">
                <PieChart width={420} height={300}>
                  <Pie
                    data={pieData}
                    cx={200}
                    cy={130}
                    outerRadius={110}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={SEX_COLORS[entry.key] ?? "#9ca3af"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Count"]} />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
