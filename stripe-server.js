import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Use environment variable for Stripe secret key
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe"
);

// Get frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8100";

app.post("/create-checkout-session", async (req, res) => {
  const { cart, shippingInfo, shipping, tax } = req.body;

  console.log("📦 Received checkout request:");
  console.log("- Cart items:", cart?.length || 0);
  console.log("- Customer:", shippingInfo?.email);
  console.log("- Shipping:", shipping);
  console.log("- Tax:", tax);

  try {
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "php",
        product_data: {
          name: `${item.product.name} - ${
            item.boxSize
              ? item.boxSize.charAt(0).toUpperCase() +
                item.boxSize.slice(1) +
                " Box"
              : "Regular Box"
          }`,
          description: `${
            item.boxSize
              ? item.boxSize.charAt(0).toUpperCase() + item.boxSize.slice(1)
              : "Regular"
          } box`,
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (shipping > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (tax > 0) {
      line_items.push({
        price_data: {
          currency: "php",
          product_data: {
            name: "Tax (12% VAT)",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/orderconfirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
      customer_email: shippingInfo.email,
      metadata: {
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      },
    });

    console.log("✅ Checkout session created:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Stripe server running on port ${PORT}`));
