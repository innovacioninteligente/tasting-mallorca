
'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function createPaymentIntent(
  amount: number,
  name: string,
  email: string,
  metadata: { [key: string]: string }
) {
  try {
    let customer;
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length > 0) {
        customer = customers.data[0];
    } else {
        customer = await stripe.customers.create({
            name: name,
            email: email,
        });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'eur',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata,
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
