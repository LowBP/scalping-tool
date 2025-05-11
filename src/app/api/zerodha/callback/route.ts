import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KiteConnect } from "kiteconnect";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const request_token = searchParams.get("request_token");

    if (!request_token) {
        return NextResponse.json({ error: "Missing request token" }, { status: 400 });
    }

    const cookieStore = cookies();
    const encoded = (await cookieStore).get("kite_auth")?.value;

    if (!encoded) {
        return NextResponse.json({ error: "Missing credentials in cookie" }, { status: 400 });
    }

    const [apiKey, secretKey] = Buffer.from(encoded, "base64").toString().split("|");

    const kc = new KiteConnect({ api_key: apiKey });

    try {
        const session = await kc.generateSession(request_token, secretKey);
        const { user_id: userId, access_token: accessToken } = session;

        // ✅ Set HTTP-only access token cookie
        (await
            // ✅ Set HTTP-only access token cookie
            cookieStore).set(`access_token_${userId}`, accessToken, {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 16 * 60 * 60, // 16 hours
                sameSite: "lax",
            });

        // Optional: clear kite_auth after use
        (await
            // Optional: clear kite_auth after use
            cookieStore).set("kite_auth", "", {
                path: "/",
                maxAge: 0,
            });

        return NextResponse.json({ success: true, accessToken, userId });
    } catch (err: unknown) {
        console.error("Kite session error:", err);
        return NextResponse.json({ error: (err as { message: string }).message || "Failed to authenticate" }, { status: 500 });
    }
}