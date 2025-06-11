// app/api/search/route.ts (Only works in App Router!)
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const apiRes = await fetch(`https://saavn.dev/api/search/songs?query=${q}`);
  const data = await apiRes.json();

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // if calling cross-origin
    },
  });
}
