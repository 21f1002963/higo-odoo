'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
          <p className="mb-8 text-muted-foreground">
            A critical error occurred. Please try again later.
          </p>
          <Button 
            onClick={() => reset()}
            variant="default"
          >
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}