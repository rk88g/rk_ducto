"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiBaseUrl,
  googleMapsEmbedUrl,
  sessionCookieName,
  userCookieName
} from "@/lib/auth";

type VerifyResponse = {
  user: {
    username: string;
    name: string;
  };
};

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

export function ProtectedMap() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");
  const [clientName, setClientName] = useState("");

  const token = useMemo(() => readCookie(sessionCookieName), []);

  useEffect(() => {
    setClientName(readCookie(userCookieName));

    if (!apiBaseUrl) {
      setError("Falta configurar NEXT_PUBLIC_API_BASE_URL en el frontend.");
      setIsChecking(false);
      return;
    }

    if (!token) {
      router.replace("/");
      return;
    }

    let isMounted = true;

    async function verifySession() {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });

        const payload = (await response.json()) as Partial<VerifyResponse> & {
          message?: string;
        };

        if (!response.ok || !payload.user) {
          throw new Error(payload.message || "Sesion invalida.");
        }

        if (isMounted) {
          setClientName(payload.user.name);
          setError("");
        }
      } catch (verifyError) {
        if (isMounted) {
          document.cookie = `${sessionCookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
          document.cookie = `${userCookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
          setError(
            verifyError instanceof Error
              ? verifyError.message
              : "No fue posible validar la sesion."
          );
          router.replace("/");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  function handleLogout() {
    document.cookie = `${sessionCookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${userCookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="map-shell">
      <header className="map-topbar">
        <div>
          <p className="eyebrow">Panel privado</p>
          <p className="lead compact">
            {clientName
              ? `Sesion activa para ${clientName}.`
              : "Solo clientes autorizados pueden ver esta vista."}
          </p>
        </div>

        <button className="ghost-button" onClick={handleLogout} type="button">
          Cerrar sesion
        </button>
      </header>

      {isChecking ? (
        <section className="map-message">
          <p>Validando acceso...</p>
        </section>
      ) : null}

      {!isChecking && error ? (
        <section className="map-message">
          <p>{error}</p>
        </section>
      ) : null}

      {!isChecking && !error ? (
        googleMapsEmbedUrl ? (
          <section className="map-frame">
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
              title="Mapa RK Ducto Salamanca"
            />
          </section>
        ) : (
          <section className="map-message">
            <p>
              Configura `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` para mostrar el mapa
              embebido.
            </p>
          </section>
        )
      ) : null}
    </main>
  );
}

