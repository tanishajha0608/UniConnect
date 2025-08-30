"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Star } from "lucide-react"
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

  if (!ride) return null

  console.log("Rendering modal with ride:", ride.id)

  // Add a simple test to see if the component is rendering
  if (isOpen) {
    console.log("Modal is open, rendering...")
  }

  return (
    <>
      {/* Simple test modal that should always show when isOpen is true */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleClose}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>TEST MODAL - Ride Request</h2>
            <p>This is a test modal for ride: {ride.destination}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 9999 }}>
          <div style={{ position: 'relative', zIndex: 10000 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={ride.creator.avatar} alt={ride.creator.name} />
              <AvatarFallback>{ride.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{ride.creator.name}</div>
              <div className="text-sm text-muted-foreground">Ride to {ride.destination}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Request to join this ride and save money on your trip to the airport.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ride Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">From:</span>
              <span>{ride.departureLocation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">To:</span>
              <span>{ride.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span>{ride.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Time:</span>
              <span>{ride.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Price:</span>
              <span className="text-green-600 font-semibold">{ride.price}</span>
              <span className="text-muted-foreground line-through">{ride.originalPrice}</span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ride.creator.avatar} alt={ride.creator.name} />
              <AvatarFallback>{ride.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{ride.creator.name}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              Let the driver know if you have any special requirements or questions.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending Request..." : "Send Request"}
          </Button>
                 </DialogFooter>
       </DialogContent>
     </Dialog>
     </>
   )
 } 