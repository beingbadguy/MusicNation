import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");

    const apiRes = await fetch(
      `https://saavn.dev/api/search/songs?query=${q}&page=${page}&limit=${limit}`
    );
    const data = await apiRes.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // if calling cross-origin
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
