import React from "react";

export function Alert({ type = "info", message }: { type?: "info" | "success" | "error"; message: string }) {
  const color =
    type === "success"
      ? "bg-green-100 text-green-800"
      : type === "error"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  return (
    <div className={`rounded px-4 py-2 mb-2 ${color}`}>{message}</div>
  );
}
