import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
          variant === "default"
            ? "bg-slate-900 text-slate-50 hover:bg-slate-800 active:brightness-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:active:bg-slate-300"
            : "border border-slate-200 hover:bg-slate-100 active:brightness-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:active:text-white",
            size === "default"
            ? "h-10 py-2 px-4"
            : size === "sm"
            ? "h-9 px-3 rounded-md"
            : "h-10 w-10 p-0", //icon size
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
