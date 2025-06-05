import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming this exists for terms and conditions

export default function SignUpPage() {
  // In a real app, you'd use useState for form fields and handle submission
  // For OTP, you might change a state to show OTP input here or navigate

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create an Account
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Start your journey with us today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            required 
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            required
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" className="dark:border-gray-700 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500" />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none text-gray-600 dark:text-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">terms and conditions</Link>
          </Label>
        </div>
        {/* The button will navigate to OTP page, for now href is /otp */}
        {/* In a real app, this would be a submit button that triggers OTP sending logic */}
        <Link href="/otp?type=signup" legacyBehavior passHref>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                <a>Create Account & Verify</a>
            </Button>
        </Link>

      </CardContent>
      <CardFooter className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
} 