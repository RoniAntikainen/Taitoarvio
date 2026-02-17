// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) return NextResponse.json({ error: "Missing webhook signature/secret" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` }, { status: 400 });
  }

  const upsertByCustomer = async (stripeCustomerId: string, data: Partial<{
    status: string;
    stripeSubscriptionId: string | null;
    currentPeriodEnd: Date | null;
    trialEndsAt: Date | null;
    cancelAtPeriodEnd: boolean;
  }>) => {
    const sub = await prisma.subscription.findFirst({
      where: { stripeCustomerId },
      select: { id: true, userId: true },
    });

    if (!sub) return;

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: data.status ?? undefined,
        stripeSubscriptionId: data.stripeSubscriptionId ?? undefined,
        currentPeriodEnd: data.currentPeriodEnd ?? undefined,
        trialEndsAt: data.trialEndsAt ?? undefined,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? undefined,
      },
    });
  };

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const s = event.data.object as Stripe.Subscription;

        const statusMap = (st: Stripe.Subscription.Status): string => {
          // Sovi sun enumiin: FREE|TRIAL|ACTIVE|PAST_DUE|CANCELED
          if (st === "active") return "ACTIVE";
          if (st === "trialing") return "TRIAL";
          if (st === "past_due" || st === "unpaid") return "PAST_DUE";
          if (st === "canceled") return "CANCELED";
          return "FREE";
        };

        await upsertByCustomer(String(s.customer), {
          status: statusMap(s.status),
          stripeSubscriptionId: s.id,
          currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end * 1000) : null,
          trialEndsAt: s.trial_end ? new Date(s.trial_end * 1000) : null,
          cancelAtPeriodEnd: !!s.cancel_at_period_end,
        });

        break;
      }

      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        // Jos tarvitset linkitystä customerId -> userId, tee se checkoutin aikana (parasta).
        // Täällä voidaan ainakin varmistaa, että stripeCustomerId tallentuu jos userId löytyy metadata:sta.
        const userId = cs.metadata?.userId;
        const customerId = cs.customer ? String(cs.customer) : null;

        if (userId && customerId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: { stripeCustomerId: customerId },
            create: { userId, stripeCustomerId: customerId, status: "TRIAL" },
          });
        }

        break;
      }

      default:
        break;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
