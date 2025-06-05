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
import { Separator } from "@/components/ui/separator"; // Assuming this exists for a visual break

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email or Username</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
          Sign In
        </Button>
        
        {/* Optional: Social Login Separator and Buttons */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="dark:bg-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            {/* Placeholder for Google Icon */}
            Google
          </Button>
          <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            {/* Placeholder for GitHub Icon */}
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
} 