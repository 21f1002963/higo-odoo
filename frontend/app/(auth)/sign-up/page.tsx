"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Lock, Mail, User as UserIcon, KeyRound } from "lucide-react"; // Added KeyRound for OTP

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const signUpFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [signUpData, setSignUpData] = useState<SignUpFormValues | null>(null);

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  async function onSignUpSubmit(values: SignUpFormValues) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to /api/auth/sign-up
      // const response = await fetch("/api/auth/sign-up", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: values.email, password: values.password, username: values.username }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || "Sign-up failed. Please try again.");
      // }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Sign-up submitted with:", values);
      // Assuming backend sends an OTP to the user's email/phone
      
      setSignUpData(values); // Store data for OTP step
      setShowOtpForm(true);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "An unexpected error occurred during sign-up.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onOtpSubmit(values: OtpFormValues) {
    if (!signUpData) {
      toast({ title: "Error", description: "Sign-up data not found. Please try signing up again.", variant: "destructive" });
      setShowOtpForm(false);
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to /api/auth/verify-otp
      // const response = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: signUpData.email, otp: values.otp }),
      // });
      // const data = await response.json(); 
      // if (!response.ok) {
      //   throw new Error(data.message || "OTP verification failed.");
      // }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("OTP submitted with:", values.otp, "for user:", signUpData.email);
      
      const mockToken = "mock-jwt-token-for-" + signUpData.email;
      const mockUser = { id: "1", email: signUpData.email, username: signUpData.username };
      // In a real app, token and user data would come from API response (data.token, data.user)

      await signIn(mockToken, mockUser);

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created and verified!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "OTP Verification Error",
        description: error.message || "An unexpected error occurred during OTP verification.",
        variant: "destructive",
      });
      otpForm.reset(); // Reset OTP form on error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        {!showOtpForm ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>
                Enter your details to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="yourusername" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="you@example.com" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {signUpData?.email}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <Button variant="link" onClick={() => { setShowOtpForm(false); otpForm.reset(); signUpForm.reset(); }} disabled={isSubmitting}>
                Back to Sign Up
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
} 