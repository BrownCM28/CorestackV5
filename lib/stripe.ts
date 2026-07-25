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
  origin: string
): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Job listing: ${job.title}` },
          unit_amount: job.paid_amount_cents,
        },
        quantity: 1,
      },
    ],
    metadata: { job_id: job.id },
    success_url: `${origin}/post/success`,
    cancel_url: `${origin}/dashboard/employer?checkout=canceled`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  return session.url
}
