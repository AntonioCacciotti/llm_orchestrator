"use client";

import AuthGuard from "@/components/AuthGuard";
import { getToken } from "@/lib/auth";
import { getProfile, PlayerProfileResponse } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WeatherData {
  temp: string;
  desc: string;
}

function getGreeting(name: string | null, username: string | null): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const displayName = name || username || "there";
  return `Good ${period}, ${displayName}!`;
}

function formatDate(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatMemberSince(createdAt: string | null): string {
  if (!createdAt) return "—";
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calcDaysAsMember(createdAt: string | null): number | null {
  if (!createdAt) return null;
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

interface BirthdayInfo {
  daysUntil: number;
  age: number;
}

function getBirthdayInfo(birthday: string | null): BirthdayInfo | null {
  if (!birthday) return null;
  const parts = birthday.split("-").map(Number);
  const [byear, bmonth, bday] = parts;
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();

  const thisYearMs = new Date(ty, bmonth - 1, bday).getTime();
  const todayMs = new Date(ty, tm - 1, td).getTime();

  let daysUntil: number;
  if (thisYearMs < todayMs) {
    daysUntil = Math.ceil(
      (new Date(ty + 1, bmonth - 1, bday).getTime() - todayMs) /
        (1000 * 60 * 60 * 24)
    );
  } else {
    daysUntil = Math.ceil((thisYearMs - todayMs) / (1000 * 60 * 60 * 24));
  }

  let age = ty - byear;
  if (tm < bmonth || (tm === bmonth && td < bday)) age--;

  return { daysUntil, age };
}

export default function HomePage() {
  const [profile, setProfile] = useState<PlayerProfileResponse | null>(null);
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherChecked, setWeatherChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getProfile(token)
      .then(setProfile)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function fetchWeather(lat?: number, lon?: number) {
      const url =
        lat != null && lon != null
          ? `https://wttr.in/?format=j1&lat=${lat}&lon=${lon}`
          : "https://wttr.in/?format=j1";
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const cond = data?.current_condition?.[0];
          if (cond) {
            setWeather({
              temp: cond.temp_C,
              desc: cond.weatherDesc?.[0]?.value ?? "",
            });
          }
        })
        .catch(() => {})
        .finally(() => setWeatherChecked(true));
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(),
        { timeout: 5000 }
      );
    } else {
      fetchWeather();
    }
  }, []);

  const isAdmin = profile?.role === "ADMIN";
  const days = calcDaysAsMember(profile?.createdAt ?? null);
  const birthdayInfo = getBirthdayInfo(profile?.birthday ?? null);

  return (
    <AuthGuard>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-greeting">
              {profile ? getGreeting(profile.name, profile.username) : "Loading…"}
            </h1>
            <p className="dashboard-datetime">
              {formatDate(now)} &middot; {formatTime(now)}
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-label">Member since</div>
            <div className="dashboard-stat-value">
              {formatMemberSince(profile?.createdAt ?? null)}
            </div>
          </div>

          {days !== null && (
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-label">Days as member</div>
              <div className="dashboard-stat-value">{days} days</div>
            </div>
          )}

          {weatherChecked && weather && (
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-label">Weather</div>
              <div className="dashboard-stat-value">{weather.temp}°C</div>
              <div className="dashboard-stat-sub">{weather.desc}</div>
            </div>
          )}

          {birthdayInfo && (
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-label">Birthday</div>
              <div className="dashboard-stat-value">
                {birthdayInfo.daysUntil === 0
                  ? "Happy Birthday!"
                  : birthdayInfo.daysUntil <= 30
                  ? `In ${birthdayInfo.daysUntil} days`
                  : `Age ${birthdayInfo.age}`}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-section-title">Quick actions</div>
        <div className="dashboard-actions">
          <Link href="/account" className="dashboard-action-card">
            <div className="dashboard-action-label">My Account</div>
            <div className="dashboard-action-desc">View and edit your profile</div>
          </Link>
          {isAdmin && (
            <Link href="/admin" className="dashboard-action-card">
              <div className="dashboard-action-label">Admin Dashboard</div>
              <div className="dashboard-action-desc">
                Manage users and view reports
              </div>
            </Link>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
