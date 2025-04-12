"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PhoneCall, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to login
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Username</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button onClick={()=>setLoading(true)} disabled={loading} className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-800 p-0">
          <Link href="/dashboard" className="cursor-pointer flex items-center justify-center gap-2 m-0 w-full">
            {loading ? <span className="flex gap-1 justify-center items-center"><Loader2 className="animate-spin" />Loading...</span> : "Login"}
          </Link>
        </Button>
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="secondary" className="w-full border hover:border-slate-300 hover:shadow-sm cursor-pointer">
          <Smartphone /> Login with Mobile (OTP)
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </div>)
  );
}
