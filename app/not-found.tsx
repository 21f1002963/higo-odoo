import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-8 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
}