"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function UserNav() {
  const router = useRouter()
  const { toast } = useToast()

  // UC Demo user data
  const user = {
    name: "Alex Johnson",
    email: "alex@berkeley.edu",
    image: "/placeholder-user.jpg",
  }

  const handleLogout = () => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would log you out.",
    })
    router.push("/")
  }

  const handleProfileClick = () => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would show your profile.",
    })
  }

  const handleSettingsClick = () => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would show settings.",
    })
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              UC Berkeley Student
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
