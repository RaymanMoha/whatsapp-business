import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms governing access to and use of the AppBase WhatsApp commerce service.",
  alternates: { canonical: "/terms" },
}

const sections = [
  {
    title: "Introduction",
    body:
      "These Terms of Service (\"Terms\") govern your access to and use of AppBase. By accessing or using the Service, you agree to be bound by these Terms.",
  },
  {
    title: "Use of Service",
    body:
      "You may use the Service only in compliance with these Terms and all applicable laws. You are responsible for any content you submit and for your conduct while using the Service.",
  },
  {
    title: "Accounts",
    body:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
  },
  {
    title: "Privacy",
    body:
      "We respect your privacy. Please review our privacy practices. By using the Service, you consent to the collection and use of information as set forth in our policies.",
  },
  {
    title: "Intellectual Property",
    body:
      "All trademarks, logos, and content provided through the Service are the property of their respective owners. You may not copy, modify, or distribute content without permission.",
  },
  {
    title: "Termination",
    body:
      "We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice.",
  },
  {
    title: "Limitation of Liability",
    body:
      "To the maximum extent permitted by law, AppBase will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
  },
  {
    title: "Governing Law",
    body:
      "These Terms are governed by the laws of your local jurisdiction unless otherwise required by applicable law.",
  },
  {
    title: "Contact",
    body:
      "Questions about these Terms? Contact us at abdulmoharayman@gmail.com.",
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen py-10 px-4 md:px-8" aria-labelledby="terms-title">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 id="terms-title" className="text-3xl md:text-4xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-white/80 mt-1">Last updated: {new Date().getFullYear()}</p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <Card key={s.title} className="bg-white text-black">
              <CardHeader className="pb-3">
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-black/80">
                {s.body}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-sm text-white/80">
          <Link href="/" className="underline">Return to Sign Up</Link>
        </div>
      </div>
    </main>
  )
}
