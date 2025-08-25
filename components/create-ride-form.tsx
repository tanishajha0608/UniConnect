"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAirportsForCampus, formatAirportWithDistance } from "@/lib/airports"
import { useToast } from "@/hooks/use-toast"

interface CreateRideFormProps {
  university: string
}

export function CreateRideForm({ university }: CreateRideFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [selectedDestination, setSelectedDestination] = useState("")
  const [customDestination, setCustomDestination] = useState("")
  const [time, setTime] = useState("")
  const [spots, setSpots] = useState("")
  const [price, setPrice] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get airports specific to this campus
  const campusAirports = getAirportsForCampus(university)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!selectedDestination || !date || !time || !spots || !price) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Determine the final destination
      const finalDestination = selectedDestination === "custom" ? customDestination : selectedDestination

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success toast
      toast({
        title: "UC Ride Created Successfully! (Demo)",
        description: `Your ride to ${finalDestination} has been created and is now visible in My Rides.`,
      })

      // Show success state
      setIsSuccess(true)

      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push(`/${university}/rides?tab=my-rides`)
      }, 1500)

    } catch (error) {
      console.error("Error creating ride:", error)
      toast({
        title: "Error",
        description: "Failed to create ride. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setDate(undefined)
    setSelectedDestination("")
    setCustomDestination("")
    setTime("")
    setSpots("")
    setPrice("")
    setNotes("")
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">UC Ride Created Successfully!</h3>
        <p className="text-muted-foreground">
          Your ride has been created and is now visible in the "My Rides" tab.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting you to My Rides...
        </p>
        <Button onClick={resetForm} variant="outline" className="mt-4">
          Create Another Ride
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination or enter custom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Destination</SelectItem>
              {campusAirports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {formatAirportWithDistance(airport)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDestination === "custom" && (
          <div>
            <Label htmlFor="customDestination">Custom Destination *</Label>
            <Input
              id="customDestination"
              placeholder="Enter destination (e.g., Downtown, Shopping Mall, etc.)"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="date">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="spots">Available Spots *</Label>
          <Input
            id="spots"
            type="number"
            min="1"
            max="8"
            placeholder="How many passengers can you take?"
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price per Person *</Label>
          <Input
            id="price"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter price in dollars"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            id="notes"
            placeholder="Any additional information for passengers..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating UC Ride..." : "Create UC Ride"}
      </Button>
    </form>
  )
}
