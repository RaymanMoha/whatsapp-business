import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ServerCog, Hammer, CircuitBoard, GitPullRequest, Shield, BookMarked, FileStack } from "lucide-react"

const infraSteps = [
  {
    title: "Bootstrap Terraform",
    description: "Initialise remote state and create baseline networking primitives",
    command: "cd infra/terraform && terraform init && terraform apply -var-file=environments/dev.tfvars",
  },
  {
    title: "Provision Firebase & BigQuery",
    description: "Creates Firestore databases, auth providers, and BigQuery datasets",
    command: "pnpm infra:firebase --env dev",
  },
  {
    title: "Seed operational data",
    description: "Populates reference customers, meters, and billing plans",
    command: "pnpm seed --filter ansu-backend --env dev",
  },
]

const workspaceStructure = [
  {
    name: "apps/",
    notes: [
      "`ansu-web` Next.js 15 dashboard",
      "`ansu-mobile` Expo workspace for internal field teams",
      "`ansu-api` Express gateway with Firebase adapters",
    ],
  },
  {
    name: "packages/",
    notes: [
      "Shared TypeScript types synced with backend",
      "UI kit built on top of shadcn components",
      "Telemetry helpers instrumented with OpenTelemetry",
    ],
  },
  {
    name: "infra/",
    notes: [
      "Terraform root module plus environment overlays",
      "Firebase hosting configs for static assets",
      "Github Actions workflows for deploy lanes",
    ],
  },
]

const releaseChecklist = [
  {
    title: "Code Quality",
    items: [
      "`pnpm lint` and `pnpm typecheck` green",
      "Contract tests for billing API updated",
      "Regression suite for top 10 dashboards run",
    ],
  },
  {
    title: "Security",
    items: [
      "Pen test findings triaged in the backlog",
      "Secrets rotated via `pnpm secrets:rotate`",
      "Audit log export attached to release ticket",
    ],
  },
  {
    title: "Stakeholder sign off",
    items: [
      "Support enablement session scheduled",
      "Customer success runbook appended",
      "Launch announcement drafted for Ops channel",
    ],
  },
]

export default function AnsuSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ANSU Enterprise Setup</h1>
          <p className="text-muted-foreground max-w-3xl">
            ANSU powers Reon&apos;s flagship energy and billing platform. Use this page as the single reference to stand up environments, understand workspace layout, and prepare production launches without hitting missing routes.
          </p>
        </div>

        <Tabs defaultValue="infrastructure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="release">Release</TabsTrigger>
          </TabsList>

          <TabsContent value="infrastructure" className="space-y-6">
            {infraSteps.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ServerCog className="size-5" />
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">{step.command}</div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="size-5" />
                  Local Development Tips
                </CardTitle>
                <CardDescription>Optimise your developer loop before diving into tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Use <span className="font-mono">pnpm dev --filter ansu-web -- --turbo</span> for faster HMR</li>
                  <li>• Start <span className="font-mono">pnpm dev --filter ansu-backend</span> when testing authenticated flows</li>
                  <li>• Run <span className="font-mono">pnpm firebase:emulators</span> to mirror auth and Firestore locally</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircuitBoard className="size-5" />
                  Repository Structure
                </CardTitle>
                <CardDescription>Understand how the monorepo is organised for cross team reuse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {workspaceStructure.map((section) => (
                    <div key={section.name} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{section.name}</h3>
                        <Badge variant="outline">Core</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {section.notes.map((note) => (
                          <li key={note}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="size-5" />
                  Branch Strategy
                </CardTitle>
                <CardDescription>How squads collaborate inside the enterprise repo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Feature branches follow the pattern <span className="font-mono">feat/ansu-{`{jira-ticket}`}</span>. Pull requests must target <span className="font-mono">develop</span>, trigger automated smoke tests, and request review from the owning squad. Weekly release branches (<span className="font-mono">release/ansu-YYYYWW</span>) collect approved work before production promotion.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="release" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Release Checklist
                </CardTitle>
                <CardDescription>End to end tasks before promoting to production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {releaseChecklist.map((section) => (
                    <div key={section.title} className="rounded-lg border border-dashed border-primary/30 p-5">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {section.items.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="size-5" />
                  Documentation Drop
                </CardTitle>
                <CardDescription>Assets we attach to every ANSU release</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Updated ADRs stored in <span className="font-mono">/docs/adr</span></li>
                  <li>• Platform changelog entry summarising customer impact</li>
                  <li>• Loom walkthrough for field teams embedded in Confluence</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileStack className="size-5" />
                  Rollback Plan
                </CardTitle>
                <CardDescription>Standard operating procedure if launch metrics degrade</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Production releases remain behind a feature flag for the first 60 minutes. If error budgets trip, toggle the release flag, redeploy the previous release branch, and file a postmortem task tagged `ansu-postmortem` to capture learnings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
