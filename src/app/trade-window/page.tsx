import { cookies } from "next/headers";

export default async function TradePage() {
    const cookieStore = cookies();
    const accessTokens = (await cookieStore).getAll()
        .filter(c => c.name.startsWith('access_token_'))
        .map(c => ({
            userId: c.name.replace('access_token_', ''),
            token: c.value,
        }));

    if (!accessTokens[0]?.userId) {
        // If the token is not available, redirect the user to the login page
        return (
            <div className="flex justify-center items-center h-dvh">
                <h1>You are not logged in.</h1>
                <a href="/login">Go to Login</a>
            </div>
        );
    }

    return <h1>Welcome </h1>;
}