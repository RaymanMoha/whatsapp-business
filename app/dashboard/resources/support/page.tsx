import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircleCode, Smartphone, Users } from "lucide-react"

const inquiryTypes = [
  {
    id: "general",
    label: "General",
    title: "General enquiries",
    description: "Partnerships, press, and company information.",
    email: "info@reoncapital.io",
    badge: "info@reoncapital.io",
  },
  {
    id: "investment",
    label: "Investment",
    title: "Investment opportunities",
    description: "Share your pitch deck or request funding conversations.",
    email: "investment@reoncapital.io",
    badge: "investment@reoncapital.io",
  },
]

const officeSupport = [
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

export default function SupportResourcesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Support Resources</h1>
          <p className="text-muted-foreground max-w-3xl">
            Contact Reon Capital using the official details published on <a className="text-primary underline-offset-4 hover:underline" href="https://www.reoncapital.io/" target="_blank" rel="noreferrer">reoncapital.io</a>. Choose the tab that matches your request and we will route you to the right team.
          </p>
        </div>

        <Tabs defaultValue={inquiryTypes[0]?.id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            {inquiryTypes.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {inquiryTypes.map((item) => (
            <TabsContent key={item.id} value={item.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Send an email and include your organisation, region, and preferred contact window.
                    </p>
                  </div>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">{item.email}</Badge>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="size-5" />
              Phone support
            </CardTitle>
            <CardDescription>Available during East Africa business hours</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-4 text-sm text-muted-foreground">
            <span>Call +254 745 541 709 for urgent matters.</span>
            <Badge variant="outline">+254 745 541 709</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Regional offices
            </CardTitle>
            <CardDescription>Meet with the team in person by scheduling ahead</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {officeSupport.map((office) => (
              <div key={office.city} className="rounded-lg border border-border/40 bg-background/60 p-4">
                <p className="text-sm font-semibold">{office.city}</p>
                <p className="text-sm text-muted-foreground">{office.address}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleCode className="size-5" />
              Online form
            </CardTitle>
            <CardDescription>
              Prefer a guided form? Visit the website and submit the message form at the bottom of the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              href="https://www.reoncapital.io/"
              target="_blank"
              rel="noreferrer"
            >
              Go to reoncapital.io
            </a>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
