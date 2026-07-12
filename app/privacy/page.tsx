import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const sections = [
  {
    title: "Overview",
    body:
      "This policy explains how the WhatsApp commerce service uses customer conversations, orders, catalog data, and administrator account information.",
  },
  {
    title: "Information We Collect",
    body:
      "We may collect information you provide directly (such as name and email) and limited technical data for functionality and security.",
  },
  {
    title: "How We Use Information",
    body:
      "We use information to operate, maintain, and improve the Service, communicate with you, and ensure security.",
  },
  {
    title: "Cookies & Local Storage",
    body:
      "The dashboard stores appearance preferences and the administrator avatar locally in the browser. Commerce records are stored in the configured database.",
  },
  {
    title: "Data Sharing",
    body:
      "We do not sell your personal information. We may share limited data as required by law or to protect our rights.",
  },
  {
    title: "Data Retention",
    body:
      "We retain information only as long as necessary for the purposes described in this Policy or as required by law.",
  },
  {
    title: "Your Choices",
    body:
      "Administrators can clear browser preferences and manage retained commerce records according to the business retention policy.",
  },
  {
    title: "Contact",
    body:
      "Privacy questions should be sent to the business contact configured by the administrator.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-10 px-4 md:px-8" aria-labelledby="privacy-title">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 id="privacy-title" className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
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

        <div className="mt-6 text-sm text-white/80 space-x-4">
          <Link href="/" className="underline">Return to Sign Up</Link>
          <Link href="/terms" className="underline">View Terms</Link>
        </div>
      </div>
    </main>
  )
}
