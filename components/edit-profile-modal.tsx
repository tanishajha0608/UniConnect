"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Upload, Camera } from "lucide-react"
import { updateProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"

interface EditProfileModalProps {
  user: UserProfile
  onProfileUpdate: (updatedUser: UserProfile) => void
  children: React.ReactNode
}

export function EditProfileModal({ user, onProfileUpdate, children }: EditProfileModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    avatarUrl: user.avatar_url || ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError("")

      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }))
      setSuccess("Photo uploaded successfully!")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError("Failed to upload photo. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First name and last name are required")
        return
      }

      if (!formData.email.trim()) {
        setError("Email is required")
        return
      }

      // Prepare update data
      const updateData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        avatar_url: formData.avatarUrl
      }

      // Update user metadata in Supabase Auth
      const { error: updateError } = await updateProfile(user.id, updateData)

      if (updateError) {
        throw updateError
      }

      // If email changed, update email in Supabase Auth
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        })

        if (emailError) {
          throw emailError
        }

        setSuccess("Profile updated! Please check your email to confirm your new email address.")
      } else {
        setSuccess("Profile updated successfully!")
      }

      // Update the parent component's user state
      const updatedUser = {
        ...user,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email,
        avatar_url: formData.avatarUrl
      }

      onProfileUpdate(updatedUser)

      // Close modal after a brief delay to show success message
      setTimeout(() => {
        setOpen(false)
        setSuccess("")
      }, 2000)

    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const userInitials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatarUrl} alt="Profile picture" />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click the camera icon to upload a new photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
              <p className="text-xs text-muted-foreground">
                Changing your email will require verification
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}