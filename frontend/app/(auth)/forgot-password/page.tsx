"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Lock, Mail, KeyRound } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const requestResetFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const resetPasswordFormSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type RequestResetFormValues = z.infer<typeof requestResetFormSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [emailForReset, setEmailForReset] = useState<string>("");

  const requestResetForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetFormSchema),
    defaultValues: { email: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  async function onRequestResetSubmit(values: RequestResetFormValues) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to /api/auth/request-password-reset
      // const response = await fetch("/api/auth/request-password-reset", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: values.email }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || "Failed to send password reset email.");
      // }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Password reset requested for:", values.email);
      
      setEmailForReset(values.email);
      setShowOtpStep(true);
      toast({
        title: "OTP Sent",
        description: "If an account exists for this email, an OTP has been sent for password reset.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResetPasswordSubmit(values: ResetPasswordFormValues) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call to /api/auth/reset-password
      // const response = await fetch("/api/auth/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: emailForReset, otp: values.otp, newPassword: values.newPassword }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || "Password reset failed.");
      // }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Password reset for:", emailForReset, "with OTP:", values.otp);

      toast({
        title: "Password Reset Successful",
        description: "Your password has been changed. Please sign in with your new password.",
      });
      router.push("/sign-in");
    } catch (error: any) {
      toast({
        title: "Password Reset Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      resetPasswordForm.resetField("otp");
      resetPasswordForm.resetField("newPassword");
      resetPasswordForm.resetField("confirmPassword");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        {!showOtpStep ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you an OTP to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...requestResetForm}>
                <form onSubmit={requestResetForm.handleSubmit(onRequestResetSubmit)} className="space-y-6">
                  <FormField
                    control={requestResetForm.control}
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
              <CardDescription>
                Enter the OTP sent to {emailForReset} and your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
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
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
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
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
        <CardFooter className="flex flex-col items-center space-y-2 mt-4">
          <Link href="/sign-in">
            <Button variant="link" className="text-sm">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 