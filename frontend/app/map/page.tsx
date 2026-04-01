import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProtectedMap } from "@/components/ProtectedMap";
import { sessionCookieName } from "@/lib/auth";

export default function MapPage() {
  const cookieStore = cookies();
  const session = cookieStore.get(sessionCookieName)?.value;

  if (!session) {
    redirect("/");
  }

  return <ProtectedMap />;
}

