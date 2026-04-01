"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  apiBaseUrl,
  buildCookie,
  sessionCookieName,
  userCookieName
} from "@/lib/auth";

type LoginResponse = {
  token: string;
  user: {
    username: string;
    name: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(
    () => searchParams.get("next") || "/map",
    [searchParams]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!apiBaseUrl) {
      setError("Falta configurar NEXT_PUBLIC_API_BASE_URL en el frontend.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const payload = (await response.json()) as Partial<LoginResponse> & {
        message?: string;
      };

      if (!response.ok || !payload.token || !payload.user) {
        throw new Error(payload.message || "No fue posible iniciar sesion.");
      }

      document.cookie = buildCookie(sessionCookieName, payload.token);
      document.cookie = buildCookie(userCookieName, payload.user.name);
      router.replace(redirectTarget);
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Error inesperado al iniciar sesion.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="card-head">
        <p className="card-kicker">Login</p>
        <h2></h2>
        <p>
          Solo usuarios permitidos.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Usuario
          <input
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="rk@ductopmx.com"
            required
            value={username}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu clave"
            required
            type="password"
            value={password}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Validando..." : "Entrar al mapa"}
        </button>
      </form>
    </section>
  );
}

