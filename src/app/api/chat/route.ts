import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  anonymousRateLimiter,
  authenticatedRateLimiter,
} from "@/lib/rate-limiter";

const WHITELISTED_IP = "192.168.1.111";

export async function POST(req: NextRequest) {
  const { transcript, query } = await req.json();

  if (!transcript || !query) {
    return NextResponse.json(
      { error: "Transcript and query are required" },
      { status: 400 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const session = await getServerSession(authOptions);

  // Если IP в белом списке, пропускаем проверку
  if (ip !== WHITELISTED_IP) {
    if (session?.user) {
      // @ts-ignore
      const userId = session.user.id;
      const { success, remaining } = await authenticatedRateLimiter.limit(userId);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } else {
      const { success, remaining } = await anonymousRateLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            error:
              "You have reached your request limit. Please sign in to continue.",
          },
          { status: 429 }
        );
      }
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${query}\n\nTranscript:\n${transcript}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from Gemini" },
      { status: 500 }
    );
  }
}