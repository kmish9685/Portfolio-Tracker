import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendIndicatorProps {
  value: number
  showIcon?: boolean
  showValue?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function TrendIndicator({
  value,
  showIcon = true,
  showValue = true,
  className,
  size = "md",
}: TrendIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  const getColorClass = () => {
    if (isPositive) return "text-chart-1"
    if (isNegative) return "text-chart-2"
    return "text-muted-foreground"
  }

  const getBackgroundClass = () => {
    if (isPositive) return "bg-chart-1/10"
    if (isNegative) return "bg-chart-2/10"
    return "bg-muted/10"
  }

  const getIcon = () => {
    const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"

    if (isPositive) return <TrendingUp className={iconSize} />
    if (isNegative) return <TrendingDown className={iconSize} />
    return <Minus className={iconSize} />
  }

  const formatValue = (val: number) => {
    return `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`
  }

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1 px-2 py-1 rounded-md",
        getBackgroundClass(),
        getColorClass(),
        className,
      )}
    >
      {showIcon && getIcon()}
      {showValue && (
        <span className={cn("font-medium", size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm")}>
          {formatValue(value)}
        </span>
      )}
    </div>
  )
}
