import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Phone, Share2 } from "lucide-react"

const officeLocations = [
  {
    city: "London, United Kingdom",
    address: "71-75 Shelton Street",
  },
  {
    city: "Nairobi, Kenya",
    address: "Fedha Plaza, Parklands Road",
  },
  {
    city: "Gaborone, Botswana",
    address: "iTowers, 3rd Commercial Way, CBD",
  },
  {
    city: "Mogadishu, Somalia",
    address: "Makka al Mukarramah Avenue",
  },
]

const contactChannels = [
  {
    label: "General enquiries",
    value: "info@reoncapital.io",
    type: "email",
  },
  {
    label: "Investment opportunities",
    value: "investment@reoncapital.io",
    type: "email",
  },
  {
    label: "Phone",
    value: "+254 745 541 709",
    type: "phone",
  },
]

const socialLinks = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/reoncapital" },
  { label: "X (Twitter)", url: "https://x.com/reoncapital" },
  { label: "Facebook", url: "https://www.facebook.com/reoncapital" },
]

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Reon Capital Contacts</h1>
          <p className="text-muted-foreground max-w-3xl">
            Official contact information sourced directly from <a className="text-primary underline-offset-4 hover:underline" href="https://www.reoncapital.io/" target="_blank" rel="noreferrer">reoncapital.io</a>. Use these channels for portfolio questions, partnerships, and investment enquiries.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              Offices
            </CardTitle>
            <CardDescription>Visit one of Reon Capital&apos;s regional hubs</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {officeLocations.map((office) => (
              <div key={office.city} className="rounded-lg border border-border/40 bg-secondary/10 p-4">
                <p className="text-sm font-semibold">{office.city}</p>
                <p className="text-sm text-muted-foreground">{office.address}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              Direct channels
            </CardTitle>
            <CardDescription>Choose email or phone depending on the request</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {contactChannels.map((channel) => (
              <div key={channel.value} className="rounded-lg border border-border/40 bg-background/60 p-4">
                <Badge variant="secondary" className="mb-2 w-fit">{channel.label}</Badge>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  {channel.type === "email" ? <Mail className="size-4 text-primary" /> : <Phone className="size-4 text-primary" />}
                  <span>{channel.value}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="size-5" />
              Follow Reon Capital
            </CardTitle>
            <CardDescription>Stay current with portfolio news and insights</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 text-sm text-primary">
            {socialLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 underline-offset-4 hover:underline">
                {link.label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
