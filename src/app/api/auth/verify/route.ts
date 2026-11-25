import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken, startSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const user = token ? await consumeLoginToken(token) : null;
  if (!user) return NextResponse.redirect(new URL("/login?error=expired", request.url));
  if (user.suspended) return NextResponse.redirect(new URL("/login?error=suspended", request.url));
  await startSession(String(user._id));
  return NextResponse.redirect(new URL(user.name ? "/trips" : "/profile?welcome=1", request.url));
}
