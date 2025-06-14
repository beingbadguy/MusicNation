// "https://saavn.dev/api/songs/yDeAS8Eh/suggestions";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const response = await fetch(`https://saavn.dev/api/artists/${id}/songs`);
    const data = await response.json();
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
