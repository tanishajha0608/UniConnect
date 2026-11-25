import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Message, Ride, User } from "@/lib/models";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/rides/[id]/messages">) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  await connectDB();
  const ride = await Ride.findOne({ _id: id, "members.user": user._id }).lean();
  if (!ride) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const messages = await Message.find({ ride: id }).sort({ createdAt: 1 }).limit(300).lean();
  const users = await User.find({ _id: { $in: [...new Set(messages.map((m) => String(m.user)))] } }, { name: 1 }).lean();
  const names = new Map(users.map((u) => [String(u._id), u.name ?? "Rider"]));
  return NextResponse.json({
    messages: messages.map((m) => ({
      id: String(m._id),
      mine: String(m.user) === String(user._id),
      name: names.get(String(m.user)) ?? "Rider",
      body: m.body,
      at: m.createdAt,
    })),
  });
}
