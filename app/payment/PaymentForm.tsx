
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    setLoading(true);
    try {
      // Call backend to create payment intent
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000, currency: "usd" }), // $10.00
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error(data.error || "Failed to create payment intent");
      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Pay $10.00"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Payment successful!</div>}
    </form>
  );
}
