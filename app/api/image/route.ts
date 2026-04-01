import { NextRequest, NextResponse } from "next/server";

const ACCESS_KEY = "yHoiWBp53O6_calB3H3vP8eC7w-Uus_vcuInRzHJyZk";
const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop";

async function fetchImage(query: string, seed: number): Promise<string | null> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  );
  const data = await res.json();
  const photos = data.results || [];
  if (photos.length === 0) return null;
  const idx = seed % photos.length;
  return photos[idx].urls.regular + "&w=400&h=200&fit=crop";
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "food";
  const seed = parseInt(req.nextUrl.searchParams.get("seed") || "1");

  try {
    // Try original query first
    let url = await fetchImage(query, seed);

    // If no results, retry with just the cuisine keyword extracted from query
    if (!url) {
      const cuisineKeywords = ["indian", "mexican", "italian", "thai", "american", "mediterranean"];
      const matched = cuisineKeywords.find(c => query.toLowerCase().includes(c));
      const fallbackQuery = matched ? `${matched} food dish` : "homemade food dish";
      url = await fetchImage(fallbackQuery, seed);
    }

    return NextResponse.json({ url: url ?? FALLBACK });
  } catch {
    return NextResponse.json({ url: FALLBACK });
  }
}
