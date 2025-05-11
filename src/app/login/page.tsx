'use client';
import { useState } from 'react';
import { Container, Form, Toast, ToastContainer } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function ZerodhaLogin() {
    const [userId, setUserId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setApiSecret] = useState('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/zerodha/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey, secretKey, userId })
            });

            console.log(res, 'res', JSON.stringify({ apiKey, secretKey, userId }))

            const data = await res.json();
            if (res.ok && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                throw new Error(data.error || "Unexpected error occurred");
            }
        } catch (err: unknown) {
            console.error(err)
            setErrorMessage((err as { message: string }).message || err as string || "Something went wrong");
            setShowToast(true);
        }
    };

    return <div className='flex justify-center h-dvh'>
        <Container className="p-3 lg:w-[50%!important]  mt-40">
            <Form autoComplete="on">
                <Form.Group className="mb-3">
                    <Form.Label>USER_ID</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter the USER_ID'
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        name="userId"
                        autoComplete="userId"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>API_KEY</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter the API_KEY'
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        name='password'
                        autoComplete="password"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>API_SECRET</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter the API_SECRET'
                        value={secretKey}
                        onChange={(e) => setApiSecret(e.target.value)}
                        name='API_SECRET'
                        autoComplete='current-password'
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-center items-center gap-8">
                    <a href="/tokens" target='_blank'>Sell All Tokens</a>
                    <Button className="mt-2" variant='primary' onClick={handleLogin} >
                        Login with Zerodha
                    </Button>
                </Form.Group>

            </Form>

        </Container>
        <ToastContainer position="top-end" className="p-3">
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                bg="danger"
                delay={4000}
                autohide
            >
                <Toast.Header closeButton>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body className="text-white">{errorMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
    </div>;
}
