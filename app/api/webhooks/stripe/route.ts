import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const jobId = session.metadata?.job_id

    if (jobId) {
      const supabase = createAdminClient()
      const { error } = await supabase
        .from('jobs')
        .update({ paid_at: new Date().toISOString() })
        .eq('id', jobId)

      if (error) {
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
