import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let stripeCustomerId = user.subscription?.stripeCustomerId ?? null;

  // Luo Stripe customer jos puuttuu
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId: user.id },
    });

    stripeCustomerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId },
      create: {
        userId: user.id,
        stripeCustomerId,
        status: "FREE",
      },
    });
  }
  

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/app/settings?success=1`,
    cancel_url: `${process.env.APP_URL}/app/settings?canceled=1`,
  });

  return NextResponse.json({ url: checkout.url });
}
