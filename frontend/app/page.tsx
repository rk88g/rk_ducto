import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { sessionCookieName } from "@/lib/auth";

export default function LoginPage() {
  const hasSession = cookies().has(sessionCookieName);

  if (hasSession) {
    redirect("/map");
  }

  return (
    <main className="auth-shell">
      <section className="auth-copy">
        <p className="eyebrow">Acceso privado</p>
        <h1>RK Ducto</h1>
        <p className="lead">
          El mapa solo se muestra a clientes autorizados.
        </p>
        <div className="feature-strip">
          <span>RK</span>
          <span>MAMBO</span>
          <span>X3</span>
          <span>MORE</span>
        </div>
      </section>
      <Suspense fallback={<section className="auth-card">Cargando login...</section>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
