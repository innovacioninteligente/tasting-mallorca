
'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/app/actions/stripe';
import { Loader2 } from 'lucide-react';

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
      onReady(false);
      createPaymentIntent(amount, name, email, metadata).then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
            // Handle error case
            console.error(data.error);
            onReady(true); // Allow user to try again
        }
      });
    }
  }, [amount, name, email, metadata, onReady]);

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
  
  useEffect(() => {
      if(clientSecret) {
        // This is a bit of a hack. We need to wait for Stripe to fully initialize.
        // There's no perfect callback, so we'll use a short timeout.
        const timer = setTimeout(() => onReady(true), 1000); 
        return () => clearTimeout(timer);
      }
  }, [clientSecret, onReady]);

  if (!clientSecret) {
    // Parent component will show loader
    return null;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
