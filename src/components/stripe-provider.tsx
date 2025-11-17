
'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/app/actions/stripe';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface StripeProviderProps {
  children: React.ReactNode;
  amount: number;
  name: string;
  email: string;
  metadata: { [key: string]: string };
  onReady: (isLoading: boolean) => void;
}

export function StripeProvider({ children, amount, name, email, metadata, onReady }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (amount > 0) {
      onReady(true); // Signal that loading is starting
      createPaymentIntent(amount, name, email, metadata).then((data) => {
        if (isMounted) {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                onReady(false); // Signal that loading is complete
            } else {
                console.error(data.error);
                onReady(false); // Also signal ready on error to allow retry
            }
        }
      });
    }
    return () => {
        isMounted = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, name, email, metadata.bookingId]); // Only depend on stable values

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1abc9c', // Corresponds to your primary color
        colorBackground: '#ffffff',
        colorText: '#333333',
        fontFamily: 'Poppins, sans-serif',
        borderRadius: '6px',
      },
    },
    loader: 'always'
  };
  
  if (!clientSecret) {
    return null;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
