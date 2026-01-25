import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((_req) => {
  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*"],
};
