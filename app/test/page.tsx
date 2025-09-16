import { Button } from "@/components/ui/button"

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Test Page</h1>
        <p>If you can see this, the basic setup is working.</p>
        <Button>Test Button</Button>
      </div>
    </div>
  )
} 