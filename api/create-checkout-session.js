import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseUrl = "https://adlqpwoqikdfujfxllna.supabase.co";
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
        return;
  }

    const userId = req.body && req.body.userId;
    const email = req.body && req.body.email;

  if (!userId) {
    res.status(400).json({ error: "Missing userId" });
        return;
  }

    const origin = req.headers.origin || "https://landing-money-plan.vercel.app";

  const { data: existing } = await supabase
  .from("user_data")
  .select("stripe_customer_id")
  .eq("user_id", userId)
  .maybeSingle();

    const session = await stripe.checkout.sessions.create({
          mode: "subscription",
      line_items: [{ price: "price_1U1o7m2QEIG4BKbbFW8vOfYY", quantity: 1 }],
          success_url: origin + "/plan?checkout=success",
          cancel_url: origin + "/plan?checkout=cancelled",
          customer: existing && existing.stripe_customer_id ? existing.stripe_customer_id : undefined,
          customer_email: existing && existing.stripe_customer_id ? undefined : email,
          client_reference_id: userId,
      metadata: { userId: userId },
      subscription_data: { metadata: { userId: userId } },
      });

  res.status(200).json({ url: session.url });
}
