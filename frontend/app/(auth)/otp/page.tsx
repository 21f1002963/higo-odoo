'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // To read query params
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp"; // Assuming Shadcn UI like OTP input
import { Label } from "@/components/ui/label";
import React, { useState, Suspense } from "react";

function OTPPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpType = searchParams.get("type") || "signup"; // Default to signup
  const email = searchParams.get("email") || "your.email@example.com"; // Placeholder

  const [otp, setOtp] = useState("");

  const messages = {
    signup: {
      title: "Verify Your Account",
      description: `An OTP has been sent to ${email}. Please enter it below to complete your registration.`,
      buttonText: "Verify & Create Account",
      successRoute: "/signin", // Or a dashboard page
    },
    reset: {
      title: "Check Your Email",
      description: `We've sent an OTP to ${email}. Please enter it below to reset your password.`,
      buttonText: "Verify & Reset Password",
      successRoute: "/signin", // Or a page to set new password
    },
  };

  const currentFlow = messages[otpType as keyof typeof messages] || messages.signup;

  const handleVerify = () => {
    // Frontend-only: simulate OTP verification
    console.log("Verifying OTP:", otp, "for type:", otpType);
    // In a real app, call API here
    alert("OTP Verified (Simulated)! Redirecting...");
    router.push(currentFlow.successRoute);
  };

  const handleResendOtp = () => {
    // Frontend-only: simulate OTP resend
    console.log("Resending OTP for type:", otpType, "to email:", email);
    alert("OTP Resent (Simulated)!");
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {currentFlow.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 px-4">
          {currentFlow.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 flex flex-col items-center">
          <Label htmlFor="otp-input" className="text-gray-700 dark:text-gray-300 mb-2">
Enter 6-digit Code
</Label>
          <InputOTP
            id="otp-input"
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <React.Fragment key={index}>
                    <InputOTPSlot className="rounded-md border h-12 w-12 text-lg dark:bg-gray-800 dark:text-white dark:border-gray-700" index={index} {...slot} />
                    {index !== slots.length - 1 && index % 3 === 2 && (
                        <InputOTPSeparator className="text-gray-400 dark:text-gray-600" />
                    )}
                  </React.Fragment>
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        
        <Button onClick={handleVerify} className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
          {currentFlow.buttonText}
        </Button>
        
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Wrap with Suspense for useSearchParams
export default function OTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPPageContent />
        </Suspense>
    )
} 