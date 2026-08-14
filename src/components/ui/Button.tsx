import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20 active:scale-95",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95",
      outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95",
      ghost: "text-slate-600 hover:bg-slate-100 active:scale-95"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-6 py-3 min-h-[44px] text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
