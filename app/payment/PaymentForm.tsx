import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    // Placeholder: Call backend to create payment intent and confirm payment
    // You will connect this in the next step
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={!stripe}
      >
        Pay
      </button>
    </form>
  );
}
