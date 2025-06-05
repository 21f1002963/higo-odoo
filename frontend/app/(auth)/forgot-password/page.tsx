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
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Forgot Your Password?
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          No worries! Enter your email and we'll send you a reset OTP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
        {/* The button will navigate to OTP page, for now href is /otp */}
        {/* In a real app, this would be a submit button that triggers OTP sending logic */}
        <Link href="/otp?type=reset" legacyBehavior passHref>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                <a>Send Reset OTP</a>
            </Button>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/signin"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
} 