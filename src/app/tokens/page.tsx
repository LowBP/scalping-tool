import { cookies } from "next/headers";
import { Table } from "react-bootstrap";

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

    return <div className="container mt-4">
        <h4>Stored Zerodha Access Tokens</h4>
        <Table striped bordered hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Access Token</th>
                </tr>
            </thead>
            <tbody>
                {accessTokens.length === 0 ? (
                    <tr>
                        <td colSpan={2}>No access tokens found.</td>
                    </tr>
                ) : (
                    accessTokens.map(({ userId, token }) => (
                        <tr key={userId}>
                            <td>{userId}</td>
                            <td>{token}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    </div>
}