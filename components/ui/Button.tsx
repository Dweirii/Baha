import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button 
        ref={ref} 
        className={cn(
            `
            w-auto
            rounded-4xl
            border-transparent
            px-5
            py-3
            disabled:cursor-not-allowed
            disabled:opacity-75
            text-white
            font-semibold
            hover:opacity-75
            transition
            `,
            className
        )} 
        disabled={disabled} 
        type={type} 
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
