"use client"

import { Badge } from "@/components/ui/badge"
import { getOccupancyColor, getOccupancyText } from "@/lib/helpers"

interface OccupancyIndicatorProps {
  occupancy: number
  capacity: number
  showPercentage?: boolean
  className?: string
}

/**
 * Reusable occupancy indicator component
 * Shows occupancy status with color coding and optional percentage
 */
export function OccupancyIndicator({ 
  occupancy, 
  capacity, 
  showPercentage = false,
  className = "" 
}: OccupancyIndicatorProps) {
  const occupancyPercentage = Math.round((occupancy / capacity) * 100)
  const colorClass = getOccupancyColor(occupancyPercentage)
  const text = getOccupancyText(occupancyPercentage)
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      <Badge variant="secondary" className="text-xs">
        {text}
        {showPercentage && ` (${occupancyPercentage}%)`}
      </Badge>
    </div>
  )
} 