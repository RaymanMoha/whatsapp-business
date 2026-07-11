"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { SignUpSchema, type SignUpValues } from "@/types";
import { signUpAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ParternBg from "@/public/pattern-bg.png";
import { Checkbox } from "@/components/ui/checkbox";

// Schema centralized in types/index.ts

export function SignUpForm({
   onSubmit,
}: {
   onSubmit?: (values: SignUpValues) => Promise<void> | void;
}) {
   const form = useForm<SignUpValues>({
      resolver: zodResolver(SignUpSchema),
      defaultValues: {
         fullName: "",
         email: "",
         password: "",
         confirmPassword: "",
         acceptedTerms: false,
      },
      mode: "onTouched",
   });

   const [submitting, setSubmitting] = React.useState(false);
   const router = useRouter();

   async function handleSubmit(values: SignUpValues) {
      try {
         setSubmitting(true);
         const res = (onSubmit
            ? await onSubmit(values)
            : await signUpAction(values)) as unknown as { ok?: boolean } | void;
         if (res && "ok" in res && res.ok) {
            router.push("/dashboard");
         }
      } finally {
         setSubmitting(false);
      }
   }

   return (
      <div
         className="rounded-2xl p-8 border border-zinc-800 relative overflow-hidden"
         style={{ background: "rgba(255, 255, 255, 0.10)" }}>
         <Image
            src={ParternBg.src}
            alt=""
            fill
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0, objectFit: "cover", opacity: 0.8 }}
         />
         <div className="mb-8 text-center">
            <h1 className="text-white text-2xl font-semibold mb-2">
               Create store account
            </h1>
            <p className="text-zinc-400 text-md">
               Create access for your WhatsApp commerce dashboard
            </p>
         </div>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="space-y-5 text-white">
               <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                           <Input
                              id="fullName"
                              placeholder="Full Name"
                              autoComplete="name"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:bg-transparent focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:bg-transparent focus-visible:text-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4 autofill:bg-transparent"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:bg-transparent focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:bg-transparent focus-visible:text-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4 autofill:bg-transparent"
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
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:bg-transparent focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:bg-transparent focus-visible:text-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4 autofill:bg-transparent"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                           <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="text-white bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:bg-transparent focus:text-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:bg-transparent focus-visible:text-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 py-5.5 px-4 autofill:bg-transparent"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="acceptedTerms"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex items-start gap-3">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                                 aria-label="Accept terms"
                              />
                           </FormControl>
                           <div className="text-sm text-white/90">
                              I agree to the {" "}
                              <a href="/terms" className="underline">Terms</a>{" "}
                              and {" "}
                              <a href="/privacy" className="underline">Privacy Policy</a>.
                           </div>
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-emerald-600 font-bold text-md py-6 hover:text-white cursor-pointer"
                  disabled={submitting}>
                  {submitting ? "Creating Account…" : "Create store account"}
               </Button>
            </form>
         </Form>

         <div className="mt-6 text-center border-t border-zinc-500 pt-6">
            <p className="text-white text-sm">
               Already have an account?{" "}
               <Link
                  href="/signin"
                  className="text-emerald-600 hover:text-white transition-colors underline">
                  Sign In
               </Link>
            </p>
         </div>
      </div>
   );
}
