
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
  onReady: (isReady: boolean) => void;
}

export function StripeProvider({ children, amount, name, email, metadata, onReady }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (amount > 0) {
      onReady(false); // Signal that loading is starting
      createPaymentIntent(amount, name, email, metadata).then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          onReady(true); // Signal that loading is complete
        } else {
            console.error(data.error);
            onReady(true); // Also signal ready on error to allow retry
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, name, email, metadata]);

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
    // The parent component handles the loading indicator.
    return null;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
