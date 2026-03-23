import { NextRequest, NextResponse } from "next/server";

const ACCESS_KEY = "yHoiWBp53O6_calB3H3vP8eC7w-Uus_vcuInRzHJyZk";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "food";
  const seed = req.nextUrl.searchParams.get("seed") || "1";

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    const data = await res.json();
    const photos = data.results || [];

    if (photos.length === 0) {
      return NextResponse.json({ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop" });
    }

    // Pick deterministically based on seed so image stays consistent
    const idx = parseInt(seed) % photos.length;
    const url = photos[idx].urls.regular + "&w=400&h=200&fit=crop";
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop" });
  }
}