import React from "react";

export default function AuthorsPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Authors</h1>
        <p className="text-lg text-gray-500">Meet the contributors behind the news summaries.</p>
        {/* You can add more content or fetch author stats dynamically here */}
      </div>
    </main>
  );
}
