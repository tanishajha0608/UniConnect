"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Star, X } from "lucide-react"
import { MockRide } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface RequestRideModalProps {
  isOpen: boolean
  onClose: () => void
  ride: MockRide | null
}

export function RequestRideModal({ isOpen, onClose, ride }: RequestRideModalProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  console.log("RequestRideModal render:", { isOpen, ride: ride?.id })

  const handleSubmit = async () => {
    if (!ride) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "UC Ride Request Sent! (Demo)",
        description: `Your request to join ${ride.creator.name}'s ride to ${ride.destination} has been sent.`,
      })

      // Reset form and close modal
      setMessage("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setMessage("")
    onClose()
  }

  if (!isOpen || !ride) return null

  console.log("Rendering modal with ride:", ride.id)

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={ride.creator.avatar} alt={ride.creator.name} />
              <AvatarFallback>{ride.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{ride.creator.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ride to {ride.destination}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Ride Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">From:</span>
              <span>{ride.departureLocation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">To:</span>
              <span>{ride.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span>{ride.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Time:</span>
              <span>{ride.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Price:</span>
              <span className="text-green-600 font-semibold">{ride.price}</span>
              <span className="text-gray-500 line-through">{ride.originalPrice}</span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ride.creator.avatar} alt={ride.creator.name} />
              <AvatarFallback>{ride.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{ride.creator.name}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{ride.creator.rating} ({ride.creator.ridesCompleted} rides)</span>
              </div>
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Hi! I'd like to join your ride. I'll be ready at the pickup location..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Let the driver know if you have any special requirements or questions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1">
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Sending Request..." : "Send Request"}
          </Button>
        </div>
      </div>
    </div>
  )
} 