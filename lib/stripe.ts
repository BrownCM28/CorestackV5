import Stripe from 'stripe'
import type { Job } from './types'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return stripeInstance
}

export async function createJobCheckoutSession(
  job: Job,
  origin: string,
  customerEmail?: string
): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    metadata: { job_id: job.id },
    success_url: `${origin}/post/success`,
    cancel_url: `${origin}/dashboard/employer?checkout=canceled`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  return session.url
}
