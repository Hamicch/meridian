import { NextResponse } from "next/server";
import type { ChatResponse } from "@/lib/types";

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as ChatResponse;
  return typeof candidate.reply === "string" && typeof candidate.blocked === "boolean";
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ error: "BACKEND_URL is not configured." }, { status: 500 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(new URL("/api/chat", backendUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Unable to reach the backend." }, { status: 502 });
  }

  const rawBody = await backendResponse.text();
  const data = rawBody ? parseJson(rawBody) : null;

  if (!backendResponse.ok) {
    return NextResponse.json(
      data && typeof data === "object" ? data : { error: "Backend request failed." },
      { status: backendResponse.status },
    );
  }

  if (!isChatResponse(data)) {
    return NextResponse.json({ error: "Backend returned an invalid response." }, { status: 502 });
  }

  return NextResponse.json(data);
}
