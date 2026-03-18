import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

function buildCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Max-Age": "86400",
    ...(origin ? { Vary: "Origin" } : {}),
  };
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);

    const { reviewId, notes } = await req.json();
    if (!reviewId) throw new Error("reviewId is required");

    const { data: review, error: reviewError } = await supabaseClient
      .from("case_reviews")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        notes: notes || null,
        locked: true,
      } as any)
      .eq("id", reviewId)
      .eq("locked", false)
      .select()
      .single();

    if (reviewError) throw new Error(`Review update failed: ${reviewError.message}`);
    if (!review) throw new Error("Review not found or already locked");

    const psychologistId = userData.user!.id;

    await supabaseClient.from("platform_ledger").insert({
      type: "subscription_payment",
      amount: 15.0,
      currency: "eur",
      user_id: (review as any).user_id,
      reference_id: reviewId,
      description: "Nura Pro monthly subscription",
    } as any);

    await supabaseClient.from("platform_ledger").insert({
      type: "professional_service_fee",
      amount: 5.0,
      currency: "eur",
      user_id: (review as any).user_id,
      recipient_id: psychologistId,
      reference_id: reviewId,
      description: "Professional review service fee",
    } as any);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (stripeKey) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

      const { data: psychProfile } = await supabaseClient
        .from("profiles")
        .select("stripe_customer_id")
        .eq("user_id", psychologistId)
        .single();

      if ((psychProfile as any)?.stripe_customer_id) {
        console.log(`[COMPLETE-REVIEW] Would transfer 500 cents to ${(psychProfile as any).stripe_customer_id}`);
        // When Stripe Connect is configured:
        // await stripe.transfers.create({
        //   amount: 500,
        //   currency: "eur",
        //   destination: psychProfile.stripe_customer_id,
        //   transfer_group: reviewId,
        // });
      }
    }

    return new Response(JSON.stringify({ success: true, reviewId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[COMPLETE-REVIEW] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

