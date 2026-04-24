"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [sex, setSex] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await registerUser({ username, email, password, isAdmin, name, surname, birthday, mobilePhone, sex });
      setToken(token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1>Create Account</h1>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{ width: "auto" }}
            />
            <label htmlFor="isAdmin" style={{ marginBottom: 0 }}>Register as Admin</label>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoComplete="family-name"
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
            <label htmlFor="mobilePhone">Mobile Phone</label>
            <input
              id="mobilePhone"
              type="text"
              value={mobilePhone}
              onChange={(e) => setMobilePhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>
        <div className="link-row">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
