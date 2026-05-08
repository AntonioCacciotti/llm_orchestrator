"use client";

import AuthGuard from "@/components/AuthGuard";
import { getToken } from "@/lib/auth";
import {
  getProfile,
  getAdminUsers,
  getRegistrationTrend,
  suspendPlayer,
  activatePlayer,
  deletePlayer,
  updatePlayer,
  AdminUser,
  AdminUpdateBody,
  AdminUsersResponse,
  RegistrationTrendPoint,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "preferNotToSay", label: "Prefer not to say" },
];

const ROLE_OPTIONS = [
  { value: "PLAYER", label: "Player" },
  { value: "ADMIN", label: "Admin" },
];

const PAGE_SIZE = 10;

export default function AdminPage() {
  const router = useRouter();
  const [chartData, setChartData] = useState<AdminUsersResponse | null>(null);
  const [trendData, setTrendData] = useState<RegistrationTrendPoint[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // per-row inline errors
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  // edit modal state
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<AdminUpdateBody>({
    username: "",
    email: "",
    name: "",
    surname: "",
    sex: "",
    role: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getProfile(token)
      .then((profile) => {
        if (profile.role !== "ADMIN") {
          router.replace("/");
          return Promise.reject(new Error("not-admin"));
        }
        return Promise.all([getAdminUsers(token), getRegistrationTrend(token)]);
      })
      .then(([adminData, trend]) => {
        setChartData(adminData);
        setUsers(adminData.users);
        setTrendData(trend);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (e.message !== "not-admin") {
          setError(e.message);
          setLoading(false);
        }
      });
  }, [router]);

  function setRowError(id: string, msg: string) {
    setRowErrors((prev) => ({ ...prev, [id]: msg }));
  }

  async function handleToggleStatus(user: AdminUser) {
    const token = getToken();
    if (!token) return;
    const isSuspended = user.status === "SUSPENDED";
    try {
      if (isSuspended) {
        await activatePlayer(user.id, token);
      } else {
        await suspendPlayer(user.id, token);
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: isSuspended ? "ACTIVE" : "SUSPENDED" }
            : u
        )
      );
      setRowError(user.id, "");
    } catch (e: unknown) {
      setRowError(user.id, (e as Error).message);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (
      !confirm(
        `Delete player "${user.username}"? This cannot be undone.`
      )
    )
      return;
    const token = getToken();
    if (!token) return;
    try {
      await deletePlayer(user.id, token);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setRowErrors((prev) => {
        const next = { ...prev };
        delete next[user.id];
        return next;
      });
    } catch (e: unknown) {
      setRowError(user.id, (e as Error).message);
    }
  }

  function openEdit(user: AdminUser) {
    setEditTarget(user);
    setEditForm({
      username: user.username,
      email: user.email ?? "",
      name: user.name ?? "",
      surname: user.surname ?? "",
      sex: user.sex ?? "",
      role: user.role,
    });
    setEditError("");
  }

  function closeEdit() {
    setEditTarget(null);
    setEditError("");
  }

  async function handleSave() {
    if (!editTarget) return;
    const token = getToken();
    if (!token) return;
    setEditSaving(true);
    setEditError("");
    try {
      const updated = await updatePlayer(editTarget.id, editForm, token);
      setUsers((prev) =>
        prev.map((u) => (u.id === editTarget.id ? { ...u, ...updated } : u))
      );
      closeEdit();
    } catch (e: unknown) {
      setEditError((e as Error).message);
    } finally {
      setEditSaving(false);
    }
  }

  const pieData = chartData
    ? Object.entries(chartData.genderBreakdown)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: SEX_LABELS[key] ?? key,
          value,
          key,
        }))
    : [];

  const sortedUsers = [...users].sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const visibleUsers = sortedUsers.slice(0, visibleCount);

  return (
    <AuthGuard>
      <div className="admin-page">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        {loading && (
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading…</p>
        )}
        {error && (
          <p className="error-msg" style={{ padding: "1rem" }}>
            {error}
          </p>
        )}

        {!loading && !error && chartData && (
          <div className="admin-content">
            <div className="admin-charts-row">
              <div className="card admin-card">
                <h2 className="admin-section-title">Registration Trend</h2>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => [value, "Registrations"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
                        <Cell
                          key={entry.key}
                          fill={SEX_COLORS[entry.key] ?? "#9ca3af"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Count"]} />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </div>

            <div className="card admin-card">
              <h2 className="admin-section-title">
                Users ({users.length})
              </h2>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Sex</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((user) => {
                      const isAdmin = user.role === "ADMIN";
                      const isSuspended = user.status === "SUSPENDED";
                      return (
                        <tr key={user.id}>
                          <td className="admin-table-id">{user.id}</td>
                          <td>{user.username}</td>
                          <td>
                            <span
                              className={
                                isSuspended
                                  ? "admin-badge admin-badge-suspended"
                                  : "admin-badge admin-badge-active"
                              }
                            >
                              {user.status ?? "ACTIVE"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={
                                isAdmin
                                  ? "admin-badge admin-badge-admin"
                                  : "admin-badge admin-badge-player"
                              }
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>{SEX_LABELS[user.sex] ?? user.sex}</td>
                          <td>
                            <div className="admin-actions-cell">
                              <button
                                className={
                                  isSuspended
                                    ? "admin-action-btn admin-action-btn-activate"
                                    : "admin-action-btn admin-action-btn-suspend"
                                }
                                disabled={isAdmin}
                                onClick={() => handleToggleStatus(user)}
                              >
                                {isSuspended ? "Activate" : "Suspend"}
                              </button>
                              <button
                                className="admin-action-btn admin-action-btn-edit"
                                onClick={() => openEdit(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="admin-action-btn admin-action-btn-delete"
                                disabled={isAdmin}
                                onClick={() => handleDelete(user)}
                              >
                                Delete
                              </button>
                            </div>
                            {rowErrors[user.id] && (
                              <p className="admin-row-error">
                                {rowErrors[user.id]}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {visibleCount < sortedUsers.length && (
                <div className="admin-show-more-wrapper">
                  <button
                    className="btn admin-btn-sm admin-show-more"
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editTarget && (
          <div className="modal-overlay" onClick={closeEdit}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="modal-title">
                Edit player — {editTarget.username}
              </p>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={editForm.surname}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, surname: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Sex</label>
                <select
                  value={editForm.sex}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, sex: e.target.value }))
                  }
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  <option value="">— select —</option>
                  {SEX_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, role: e.target.value }))
                  }
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  {ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {editError && <p className="modal-error">{editError}</p>}

              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={closeEdit}
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn-save"
                  onClick={handleSave}
                  disabled={editSaving}
                >
                  {editSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
