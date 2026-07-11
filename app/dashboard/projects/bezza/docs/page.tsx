import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, GaugeCircle, Puzzle, Globe2, Blocks, RefreshCcw, Leaf } from "lucide-react"

const systemOverview = [
  {
    title: "Edge-first delivery",
    detail: "Static pre-rendered surfaces with dynamic islands backed by server actions",
    badge: "Next.js 15",
  },
  {
    title: "Ultra-light runtime",
    detail: "Shared UI primitives generated from the Photon design system",
    badge: "Design tokens",
  },
  {
    title: "API federation",
    detail: "GraphQL mesh combines pricing, inventory, and personalization feeds",
    badge: "Helix Gateway",
  },
]

const referenceFlows = [
  {
    name: "Shopper onboarding",
    points: [
      "Email-less registration with device fingerprinting",
      "Progressive profile enrichment through micro-surveys",
      "Consent vault storing audit proof for marketing channels",
    ],
  },
  {
    name: "Catalog publishing",
    points: [
      "Scheduled drops orchestrated via lightweight cron workers",
      "Automated image optimization with CDN variants",
      "Experiment flags baked into metadata descriptors",
    ],
  },
  {
    name: "Analytics",
    points: [
      "Client hints feed privacy preserving metrics",
      "Snowplow pipeline emits first party events",
      "Dashboards curated for marketing and product squads",
    ],
  },
]

const performancePatterns = [
  {
    title: "Loading strategy",
    description: "Critical CSS inlined per route with async hydration for non-blocking widgets",
  },
  {
    title: "Caching",
    description: "Smart revalidation windows tuned for flash sales and merch drops",
  },
  {
    title: "Accessibility",
    description: "Semantic primitives with automated checks inside Storybook pipelines",
  },
]

export default function BezzaDocumentationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">BEZZA Platform Documentation</h1>
          <p className="text-muted-foreground max-w-3xl">
            BEZZA focuses on lightning fast retail experiences for emerging brands. This guide captures the core architecture, reference flows, and performance guardrails our teams rely on when iterating.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="flows">Reference Flows</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="size-5" />
                  Architecture Snapshot
                </CardTitle>
                <CardDescription>
                  Lightweight stack tuned for rapid merchandising cycles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {systemOverview.map((item) => (
                    <div key={item.title} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge variant="secondary">{item.badge}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="size-5" />
                  Deployment Footprint
                </CardTitle>
                <CardDescription>How BEZZA ships across regions without sacrificing velocity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-emerald-500/10 p-4">
                    <h4 className="font-semibold">Core</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Edge runtime for checkout flows</li>
                      <li>Global CDN with stale-while-revalidate</li>
                      <li>Service worker for offline baskets</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-4">
                    <h4 className="font-semibold">Extensions</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Composable promotions engine</li>
                      <li>Localized content overrides</li>
                      <li>Partner SDK with React and Vue adapters</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="size-5" />
                  End to End Journeys
                </CardTitle>
                <CardDescription>Battle tested flows that accelerate partner launches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {referenceFlows.map((flow) => (
                    <div key={flow.name} className="rounded-lg border border-dashed border-primary/30 p-5">
                      <h3 className="text-lg font-semibold">{flow.name}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {flow.points.map((point) => (
                          <li key={point}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GaugeCircle className="size-5" />
                  Performance Playbook
                </CardTitle>
                <CardDescription>Guardrails that keep BEZZA under the 1&nbsp;s interaction target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {performancePatterns.map((pattern) => (
                    <div key={pattern.title} className="rounded-lg bg-primary/5 p-5">
                      <Blocks className="size-5 text-primary" />
                      <h3 className="mt-3 text-lg font-semibold">{pattern.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{pattern.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="size-5" />
                  Continuous Optimisation
                </CardTitle>
                <CardDescription>Ongoing efforts scheduled every sprint</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Lighthouse regression budget tracked within CI</li>
                  <li>• Real user metrics exported to BigQuery for cohort analysis</li>
                  <li>• Global error rate caps enforced via LaunchDarkly rules</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="size-5" />
                  Sustainability Profile
                </CardTitle>
                <CardDescription>Optimisations that reduce carbon footprint per request</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Edge compute regions are auto-selected based on latency and energy mix. Media assets are served from green CDN providers and we surface monthly sustainability reports inside the platform home page.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
