import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseUrl = "https://adlqpwoqikdfujfxllna.supabase.co";
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

function readRawBody(req) {
  return new Promise((resolve, reject) => {
      const chunks = [];
          req.on("data", (chunk) => chunks.push(chunk));
              req.on("end", () => resolve(Buffer.concat(chunks)));
                  req.on("error", reject);
                    });
                    }

                    export default async function handler(req, res) {
                      if (req.method !== "POST") {
                          res.status(405).end();
                              return;
                                }

                                  const rawBody = await readRawBody(req);
                                    const signature = req.headers["stripe-signature"];

                                      let event;
                                        try {
                                            event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
                                              } catch (err) {
                                                  res.status(400).send("Webhook signature verification failed");
                                                      return;
                                                        }

                                                          if (event.type === "checkout.session.completed") {
                                                              const session = event.data.object;
                                                                  const userId = session.client_reference_id || (session.metadata && session.metadata.userId);
                                                                      if (userId) {
                                                                            await supabase.from("user_data").upsert(
                                                                                    {
                                                                                              user_id: userId,
                                                                                                        is_subscribed: true,
                                                                                                                  stripe_customer_id: session.customer,
                                                                                                                            updated_at: new Date().toISOString(),
                                                                                                                                    },
                                                                                                                                            { onConflict: "user_id" }
                                                                                                                                                  );
                                                                                                                                                      }
                                                                                                                                                        }
                                                                                                                                                        
                                                                                                                                                          if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
                                                                                                                                                              const subscription = event.data.object;
                                                                                                                                                                  const isActive = subscription.status === "active" || subscription.status === "trialing";
                                                                                                                                                                      const userId = subscription.metadata && subscription.metadata.userId;
                                                                                                                                                                      
                                                                                                                                                                          if (userId) {
                                                                                                                                                                                await supabase
                                                                                                                                                                                        .from("user_data")
                                                                                                                                                                                                .update({ is_subscribed: isActive, updated_at: new Date().toISOString() })
                                                                                                                                                                                                        .eq("user_id", userId);
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                  await supabase
                                                                                                                                                                                                                          .from("user_data")
                                                                                                                                                                                                                                  .update({ is_subscribed: isActive, updated_at: new Date().toISOString() })
                                                                                                                                                                                                                                          .eq("stripe_customer_id", subscription.customer);
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                  res.status(200).json({ received: true });
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                  
