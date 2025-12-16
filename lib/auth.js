import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";

export async function getServerUser() {
  // 1) Authorization header
  const h = await headers();
  const auth = h.get("authorization");
  let token = null;

  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    token = auth.slice(7).trim();
  }

  // 2) Cookie fallback
  if (!token) {
    const c = await cookies();
    token = c.get("jobify_token")?.value || null;
  }

  if (!token) return null;

  try {
    // token payload should include: { id, role }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}