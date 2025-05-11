import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    apiKey: string;
    secretKey: string;
    userId: string;
};

export async function POST(req: NextRequest) {

    const body = await req.json();
    const { apiKey, secretKey, userId } = body as Body;


    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }


    if (!apiKey || !secretKey || !userId) {
        return NextResponse.json({ error: "Missing API Key, Secret Key, or User ID" }, { status: 400 });
    }

    try {
        const token = Buffer.from(`${apiKey}|${secretKey}|${userId}`).toString("base64");


        // const res = await fetch('/api/zerodha/auth');
        // const data = await res.json();
        const cookieStore = cookies();

        (await
            // ✅ Set HTTP-only access token cookie
            cookieStore).set('kite_auth', token, {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 16 * 60 * 60, // 16 hours
                sameSite: "lax",
            });


        const redirectUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}`;
        return NextResponse.json({ redirectUrl }, { status: 200 });
    } catch (error) {
        console.error("Initiate error:", error);
        return NextResponse.json({ error: "Failed to generate login URL" }, { status: 500 });
    }
}
