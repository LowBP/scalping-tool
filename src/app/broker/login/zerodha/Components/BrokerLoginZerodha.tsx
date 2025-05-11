'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BrokerLoginZerodha() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const requestToken = searchParams.get('request_token');

        if (!requestToken) return;

        fetch(`/api/zerodha/callback?request_token=${requestToken}`)
            .then(res => res.json())
            .then(data => {
                if (!data.accessToken) {
                    alert('Error on login');
                    return;
                }
                redirect('/trade-window');
            });
    }, [searchParams]);

    return (
        <div className="flex justify-center items-center h-dvh">
            Logging in with Zerodha...
        </div>
    );
}
