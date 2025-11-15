
'use client';

import { FirebaseProvider } from './provider';

// This component acts as a boundary to ensure Firebase is only initialized on the client.
export function FirebaseClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <FirebaseProvider>{children}</FirebaseProvider>;
}
