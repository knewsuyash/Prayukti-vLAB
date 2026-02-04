import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
    value: number[]
    min: number
    max: number
    step?: number
    onValueChange: (value: number[]) => void
    disabled?: boolean
    className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, min, max, step = 1, onValueChange, disabled, ...props }, ref) => {
        return (
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                disabled={disabled}
                onChange={(e) => onValueChange([parseInt(e.target.value)])}
                className={cn(
                    "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
