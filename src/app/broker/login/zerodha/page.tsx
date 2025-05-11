import { Suspense } from 'react';
import BrokerLoginZerodha from './Components/BrokerLoginZerodha';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading Zerodha login...</div>}>
            <BrokerLoginZerodha />
        </Suspense>
    );
}
