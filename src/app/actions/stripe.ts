'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function createPaymentIntent(
  amount: number,
  name: string,
  email: string
) {
  try {
    // Optionally, you can create a customer in Stripe
    // to associate the payment with a user.
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'eur',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // You can add any other relevant information here
        // e.g., tour_id, date, etc.
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return {
      error: 'Failed to create PaymentIntent.',
    };
  }
}
