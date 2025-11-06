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
}

export function StripeProvider({ children, amount, name, email }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent(amount, name, email).then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
            // Handle error case
            console.error(data.error);
        }
      });
    }
  }, [amount, name, email]);

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
  };

  if (!clientSecret) {
    // You can render a loading skeleton here
    return <div className="h-64 animate-pulse bg-gray-200 rounded-md"></div>;
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
