import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Payment</h1>
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </main>
  );
}
