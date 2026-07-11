import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, Layers3, Rocket, Settings, Database, Workflow, PackageSearch } from "lucide-react"

const architectureHighlights = [
  {
    title: "Modular Services",
    description: "Independent micro frontends for partner onboarding, product catalog, and reporting",
    badge: "Next.js 15",
  },
  {
    title: "API Gateway",
    description: "BFF layer aggregates partner, pricing, and authorization data",
    badge: "Edge Functions",
  },
  {
    title: "Data Domain",
    description: "Operational Postgres with nightly ETL pipelines into BigQuery",
    badge: "Data Mesh",
  },
  {
    title: "Automation",
    description: "CI/CD blueprints for multi-tenant rollouts and feature flags",
    badge: "Turborepo",
  },
]

const referenceModules = [
  {
    title: "Partner Lifecycle",
    items: [
      "Digital KYC workflows with configurable checkpoints",
      "Embedded contract templates and e-signature integration",
      "Automated credit scoring via Reon Risk Engine",
    ],
  },
  {
    title: "Financial Products",
    items: [
      "Unified product catalog with currency and geography guards",
      "Dynamic pricing engine with scenario testing",
      "Settlement scheduler with audit-ready exports",
    ],
  },
  {
    title: "Operations Console",
    items: [
      "Queue-based task routing for support teams",
      "Outage communications and global announcement system",
      "Realtime telemetry on channel health and SLA breaches",
    ],
  },
]

const integrationGuides = [
  {
    title: "Authentication",
    subtitle: "Client credential flow with organization-level scopes",
    bullets: [
      "Tenant isolation enforced through signed JWT claims",
      "Refresh token rotation stored in secrets manager",
      "Audit trail emitted to Reon Observability bus",
    ],
  },
  {
    title: "Event Streaming",
    subtitle: "Webhook relay with at-least-once delivery",
    bullets: [
      "HMAC signature validation examples for Node, Python, Go",
      "Replay protection via nonce store and timestamp guards",
      "Dead-letter queue patterns for downstream retries",
    ],
  },
  {
    title: "Partner SDK",
    subtitle: "Reference client that wraps REST and GraphQL endpoints",
    bullets: [
      "Auto generated TypeScript types and React hooks",
      "Offline caching with version pinning",
      "Telemetry hooks wired to Reon Analytics",
    ],
  },
]

export default function ZubaDocumentationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ZUBA Platform Documentation</h1>
          <p className="text-muted-foreground max-w-3xl">
            Deep dive into ZUBA&apos;s modular banking platform. Explore architectural decisions, reusable modules, and the integration playbooks teams rely on when shipping new partner experiences.
          </p>
        </div>

        <Tabs defaultValue="architecture" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="modules">Reference Modules</TabsTrigger>
            <TabsTrigger value="integrations">Integration Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers3 className="size-5" />
                  Platform Blueprint
                </CardTitle>
                <CardDescription>
                  How the ZUBA platform stitches together composable services across the Reon Capital stack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {architectureHighlights.map((item) => (
                    <div key={item.title} className="rounded-lg border border-primary/10 bg-primary/5 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge variant="secondary">{item.badge}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="size-5" />
                  Delivery Streams
                </CardTitle>
                <CardDescription>
                  Release management guardrails that keep partner deployments consistent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-emerald-500/10 p-4">
                    <h4 className="font-semibold">Foundations</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Design tokens published through Figma pipelines</li>
                      <li>Storybook regression suite with visual diffs</li>
                      <li>Playwright smoke tests attached to pull requests</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-4">
                    <h4 className="font-semibold">Runtime Quality</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Golden path load tests executed nightly</li>
                      <li>Contract testing across BFF and core services</li>
                      <li>Automated rollback orchestration via LaunchDarkly</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 p-4">
                    <h4 className="font-semibold">Operations</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>24/7 PagerDuty rotations mapped to feature areas</li>
                      <li>Health dashboards embedded inside the console</li>
                      <li>Error budgets linked directly to roadmap gates</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageSearch className="size-5" />
                  Core Libraries
                </CardTitle>
                <CardDescription>
                  Pre-built modules packaged for reuse across product squads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {referenceModules.map((module) => (
                    <div key={module.title} className="rounded-lg border border-border/40 p-5">
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {module.items.map((bullet) => (
                          <li key={bullet}>• {bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {integrationGuides.map((guide) => (
              <Card key={guide.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-5" />
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {guide.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ListChecks className="mt-1 size-4 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="size-5" />
                  Launch Readiness Checklist
                </CardTitle>
                <CardDescription>
                  Validate production readiness before cutting a new tenant build
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Platform</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Feature flag strategy documented and linked</li>
                      <li>Disaster recovery runbook reviewed with ops</li>
                      <li>Centralized observability dashboards shared</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Partners</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Sandbox credentials rotated after UAT sign-off</li>
                      <li>Billing alignment captured in Confluence</li>
                      <li>Support SLAs acknowledged by both parties</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
