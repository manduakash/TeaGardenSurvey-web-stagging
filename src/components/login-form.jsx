"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "react-cookies";
import { toast } from "sonner";
import { getUserData } from "@/utils/cookies";

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await response.json();

      if (data.success) {
        const { UserTypeID } = data.data;
        toast(
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="font-medium">Success</span>
          </div>,
          {
            description: <span className="text-black">{data?.message}</span>,
            cancel: {
              label: "Close",
              onClick: () => console.log("Toast dismissed"),
            },
          }
        );
        const jsonData = JSON.stringify(data?.data);
        const encodedData = btoa(encodeURIComponent(jsonData));

        Cookies.save("userData", encodedData);
        router.push("/dashboard");
      } else {
        toast(
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500" size={20} />
            <span className="font-medium">Error</span>
          </div>,
          {
            description: data?.message,
            cancel: {
              label: "Close",
              onClick: () => console.log("Toast dismissed"),
            },
          }
        );
      }
    } catch (error) {
      console.log("Error logging in:", error);
      toast(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500" size={20} />
          <span className="font-medium">Error</span>
        </div>,
        {
          description: error.message,
          cancel: {
            label: "Close",
            onClick: () => console.log("Toast dismissed"),
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to login
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Username</Label>
          <Input
            id="userId"
            type="text"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-3 relative">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              placeholder="* * * * * * *"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-800 p-0"
        >
          {loading ? (
            <span className="flex gap-1 justify-center items-center">
              <Loader2 className="animate-spin" />
              Loading...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </form>
  );
}
