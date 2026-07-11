import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gauge, TimerReset, Workflow, CloudCog } from "lucide-react"

const tierLimits = [
  {
    tier: "Sandbox",
    limits: [
      "60 requests per minute",
      "Burst up to 120 within 30 seconds",
      "Intended for integration testing",
    ],
  },
  {
    tier: "Production Standard",
    limits: [
      "300 requests per minute",
      "Burst up to 900 within 2 minutes",
      "Shared across organisation tenant",
    ],
  },
  {
    tier: "High Volume",
    limits: [
      "1,000 requests per minute",
      "Burst up to 3,000",
      "Requires signed addendum",
    ],
  },
]

const retryHeaders = `HTTP/1.1 429 Too Many Requests
Retry-After: 20
X-Reon-RateLimit-Limit: 300
X-Reon-RateLimit-Remaining: 0
X-Reon-RateLimit-Reset: 2024-10-28T12:34:56Z`

const bestPractices = [
  "Use idempotent request ids when retrying writes",
  "Spread batch jobs across minute boundaries",
  "Prefer bulk endpoints instead of looping single requests",
  "Monitor remaining quota headers to adjust throughput",
]

export default function CommonApiRateLimitsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Rate Limits</h1>
          <p className="text-muted-foreground max-w-3xl">
            All Reon APIs enforce the same throttling rules so that partners see predictable behaviour across projects. Use the tables and guidance here to plan throughput safely.
          </p>
        </div>

        <Tabs defaultValue="tiers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="practices">Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="size-5" />
                  Throttling tiers
                </CardTitle>
                <CardDescription>Aligned across ENEVA, ZUBA, and BEZZA gateways</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {tierLimits.map((tier) => (
                  <div key={tier.tier} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{tier.tier}</h3>
                      <Badge variant="outline">Default</Badge>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {tier.limits.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="headers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TimerReset className="size-5" />
                  Retry headers
                </CardTitle>
                <CardDescription>How the gateway communicates quota status</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{retryHeaders}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="size-5" />
                  Handling 429 responses
                </CardTitle>
                <CardDescription>Respect quotas while keeping customer flows responsive</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Implement exponential backoff with jitter. For background batches, pause for the `Retry-After` duration before resuming. For user-facing flows, display a friendly banner and retry once the header timestamp passes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudCog className="size-5" />
                  Scaling best practices
                </CardTitle>
                <CardDescription>Patterns we recommend before requesting higher tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {bestPractices.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
