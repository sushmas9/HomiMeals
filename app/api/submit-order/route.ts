import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = "https://sushmasara9.app.n8n.cloud/webhook-test/meal-recommendation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("[v0] Proxying request to n8n webhook:", body);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[v0] n8n response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch recommendations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[v0] n8n response data:", data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Error calling n8n webhook:", error);
    return NextResponse.json(
      { error: "Failed to connect to recommendation service" },
      { status: 500 }
    );
  }
}
