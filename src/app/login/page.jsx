import { GalleryVerticalEnd, Sprout } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image";
import image from "@/assets/login-bg.webp"
import Link from "next/link";
import Icon from "@/assets/favicon/android-chrome-512x512.png";

export default function LoginPage() {
  return (
    (<div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="flex items-center justify-center p-0 rounded-full ring-2 ring-[#77B254] bg-green-200 dark:bg-slate-800">
            <Image src={Icon} alt="logo" width={26} height={26}  />
          </div>
            Tea Garden Survey.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-slate-800 bg-gradient-to-tl from-black via-black/55 to-amber-500 relative hidden lg:block pt-18">
      <div className="flex flex-col items-center justify-end h-full w-full text-center pb-16">
        <h1 className="text-white font-extrabold text-center px-10 text-4xl z-10">Empowering Tea Garden Workers </h1>
        <h1 className="text-white text-center px-10">Through Data & Health-Care Tracking, Nutrition & Social Welfare for a Better Future</h1>
      </div>
        <Image
          src={image}
          alt="Image"
          className="absolute inset-0 opacity-50 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>)
  );
}
