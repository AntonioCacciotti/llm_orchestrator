"use client";

import AuthGuard from "@/components/AuthGuard";
import { clearToken, getToken } from "@/lib/auth";
import { getProfile, updateProfile, PlayerProfileResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<PlayerProfileResponse | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [sex, setSex] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getProfile(token)
      .then((p) => {
        setProfile(p);
        setUsername(p.username ?? "");
        setEmail(p.email ?? "");
        setName(p.name ?? "");
        setSurname(p.surname ?? "");
        setBirthday(p.birthday ?? "");
        setMobilePhone(p.mobilePhone ?? "");
        setSex(p.sex ?? "");
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await updateProfile(token, {
        username,
        email,
        name,
        surname,
        birthday,
        mobilePhone,
        sex,
      });
      setProfile(updated);
      setUsername(updated.username ?? "");
      setEmail(updated.email ?? "");
      setName(updated.name ?? "");
      setSurname(updated.surname ?? "");
      setBirthday(updated.birthday ?? "");
      setMobilePhone(updated.mobilePhone ?? "");
      setSex(updated.sex ?? "");
      setSuccess("Profile updated successfully.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <AuthGuard>
      <div className="page-center">
        <div className="card" style={{ maxWidth: 480 }}>
          <h1>My Account</h1>

          {loading && <p style={{ textAlign: "center" }}>Loading…</p>}

          {!loading && (
            <>
              {profile && (
                <div className="form-group">
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>ID</span>
                  <span style={{ fontSize: "1rem" }}>{profile.id}</span>
                </div>
              )}

              {profile?.createdAt && (
                <div className="form-group">
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Member since</span>
                  <span style={{ fontSize: "1rem" }}>{profile.createdAt}</span>
                </div>
              )}

              {profile && (
                <div className="form-group">
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Role</span>
                  <span style={{ fontSize: "1rem" }}>{profile.role === "ADMIN" ? "Admin" : "Player"}</span>
                </div>
              )}

              {error && <p className="error-msg">{error}</p>}
              {success && (
                <p style={{ color: "#16a34a", fontSize: "0.875rem", marginBottom: "0.75rem", textAlign: "center" }}>
                  {success}
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">First name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="surname">Last name</label>
                  <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="birthday">Birthday</label>
                  <input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobilePhone">Mobile phone</label>
                  <input
                    id="mobilePhone"
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sex">Sex</label>
                  <select
                    id="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      fontSize: "1rem",
                      padding: "0.5rem 0.75rem",
                      outline: "none",
                    }}
                  >
                    <option value="">— select —</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ marginTop: "0.5rem" }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>

              <button
                className="btn"
                style={{ marginTop: "0.75rem", background: "#e5e7eb", color: "#111" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
