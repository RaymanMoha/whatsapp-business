"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInValues } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction } from "@/actions/auth";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ParternBg from "@/public/pattern-bg.png";
import Image from "next/image";

// Schema centralized in types/index.ts

export function SignInForm({
   onSubmit,
}: {
   onSubmit?: (values: SignInValues) => Promise<void> | void;
}) {
   const form = useForm<SignInValues>({
      resolver: zodResolver(SignInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
      mode: "onTouched",
   });

   const [submitting, setSubmitting] = React.useState(false);
   const [authError, setAuthError] = React.useState("");
   const router = useRouter();
   const searchParams = useSearchParams();
   const nextPath = searchParams.get("next");

   function getSafeRedirectPath() {
      if (nextPath?.startsWith("/dashboard")) {
         return nextPath;
      }

      return "/dashboard";
   }

   async function handleSubmit(values: SignInValues) {
      try {
         setSubmitting(true);
         setAuthError("");
         const res = (onSubmit
            ? await onSubmit(values)
            : await signInAction(values)) as unknown as { ok?: boolean; error?: string } | void;

         if (res && res.ok === false) {
            setAuthError(res.error || "Sign in failed.");
            return;
         }
         
         const redirectPath = getSafeRedirectPath();
         router.push(redirectPath);
      } catch (error) {
         console.error("Sign in error:", error);
         setAuthError("Sign in failed. Please try again.");
      } finally {
         setSubmitting(false);
      }
   }

   return (
      <div
         className="rounded-2xl p-8 border border-zinc-800 relative overflow-hidden"
         style={{
            backgroundColor: "rgba(255, 255, 255, 0.10)",
         }}>
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
            sizes="(max-width: 1024px) 100vw, 448px"
         />
         <div className="mb-12 text-center">
            <h1 className="text-white text-2xl font-semibold mb-2">
               Welcome back!
            </h1>
            <p className="text-zinc-400 text-md">
               Sign in to manage your WhatsApp storefront
            </p>
         </div>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="space-y-8 text-white">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="you@example.com"
                              type="email"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:bg-transparent focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:bg-transparent focus-visible:text-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4 autofill:bg-transparent"
                              autoComplete="email"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="••••••••"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4"
                              type="password"
                              autoComplete="current-password"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-emerald-600 font-bold text-lg py-6 hover:text-white cursor-pointer"
                  disabled={submitting}>
                  {submitting ? "Signing in…" : "Sign in to dashboard"}
               </Button>
               {authError ? (
                  <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                     {authError}
                  </p>
               ) : null}
            </form>
         </Form>

         <div className="mt-6 text-center border-t border-zinc-500 pt-6">
            <p className="text-white text-sm">
               Don&apos;t have an account?{" "}
               <Link
                  href="/"
                  className="text-emerald-600 hover:text-white transition-colors underline">
                  Sign Up
               </Link>
            </p>
         </div>
      </div>
   );
}

export default SignInForm;
