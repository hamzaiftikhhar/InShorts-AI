"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

const Tabs = ({ className, value, onValueChange, ...props }: TabsProps) => {
  return <div className={cn("", className)} {...props} />
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1", className)}
    {...props}
  />
))
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-slate-50 shadow-sm" : "text-slate-500 hover:text-slate-900",
        className,
      )}
      onClick={() => context?.onValueChange(value)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

// Create a context for the tabs
const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

// Wrap the Tabs component to provide context
const TabsProvider = ({ children, value, onValueChange }: TabsProps) => {
  return <TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider>
}

// Export a wrapped version of Tabs
const WrappedTabs = ({ children, ...props }: TabsProps) => {
  return (
    <TabsProvider {...props}>
      <Tabs {...props}>{children}</Tabs>
    </TabsProvider>
  )
}

export { WrappedTabs as Tabs, TabsList, TabsTrigger }
