import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, wrapperClassName, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)

        return (
            <div className={cn("relative flex items-center", wrapperClassName)}>
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-12", className)}
                    ref={ref}
                    {...props}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 dark:text-secondary flex items-center justify-center hover:text-primary transition-colors focus:outline-none"
                >
                    <span className="material-symbols-outlined select-none" aria-hidden="true">
                        {showPassword ? "visibility_off" : "visibility"}
                    </span>
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </button>
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
