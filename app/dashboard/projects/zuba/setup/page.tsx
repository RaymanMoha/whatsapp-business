import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Terminal, Wrench, ShieldCheck, GitBranch, CloudCog, BookOpenText } from "lucide-react"

const prerequisites = [
  {
    title: "Core Tooling",
    items: [
      "Node.js 20.x with pnpm 9",
      "Docker Desktop with BuildKit enabled",
      "Terraform CLI 1.7+",
    ],
  },
  {
    title: "Access",
    items: [
      "Reon SSO account with ZUBA project scope",
      "Vault token for secrets sync",
      "Segment workspace invite for analytics",
    ],
  },
  {
    title: "Environment Files",
    items: [
      "Copy .env.example into apps/zuba-web/.env.local",
      "Pull shared secrets via `pnpm secrets:pull`",
      "Verify shared certificates in ./infra/certs",
    ],
  },
]

const bootstrapSteps = [
  {
    title: "Clone & bootstrap",
    command: "pnpm create-workspace zuba --from git@github.com:reon-capital/zuba-suite.git",
    notes: "Creates a fresh workspace with web, api, and infra packages wired to Turborepo",
  },
  {
    title: "Install modules",
    command: "pnpm install && pnpm turbo run lint",
    notes: "Validates lockfile integrity and ensures generator outputs are tracked",
  },
  {
    title: "Provision cloud",
    command: "cd infra/terraform && terraform apply -var-file=environments/dev.tfvars",
    notes: "Creates shared VPC, Postgres cluster, and secrets broker per environment",
  },
  {
    title: "Launch dev server",
    command: "pnpm dev --filter zuba-web",
    notes: "Runs the Next.js development server with mocked partner integrations",
  },
]

const qualityGates = [
  {
    title: "Static Analysis",
    bullets: [
      "`pnpm lint` must pass with zero warnings",
      "Type checking via `pnpm typecheck`",
      "Chromatic visual tests for UI deltas",
    ],
  },
  {
    title: "Security",
    bullets: [
      "Snyk scan executed and uploaded to workspace",
      "Secrets rotation confirmed in Vault audit log",
      "Partner PII masked in seeded fixtures",
    ],
  },
  {
    title: "Operations",
    bullets: [
      "Grafana dashboard updated with new service targets",
      "Incident playbook appended to Ops glossary",
      "PagerDuty escalation policy reviewed",
    ],
  },
]

export default function ZubaSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ZUBA Platform Setup Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            Follow this guided path to get a full ZUBA workspace running locally and in shared cloud environments. The flow mirrors the same steps our platform team uses during new partner launches.
          </p>
        </div>

        <Tabs defaultValue="prerequisites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
            <TabsTrigger value="bootstrap">Bootstrap</TabsTrigger>
            <TabsTrigger value="quality">Quality Gates</TabsTrigger>
          </TabsList>

          <TabsContent value="prerequisites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  Environment Checklist
                </CardTitle>
                <CardDescription>
                  Confirm your workstation is aligned with Reon platform standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {prerequisites.map((group) => (
                    <div key={group.title} className="rounded-lg border border-dashed border-primary/30 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{group.title}</h3>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bootstrap" className="space-y-6">
            {bootstrapSteps.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="size-5" />
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.notes}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">
                    {step.command}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="size-5" />
                  Workspace Commands
                </CardTitle>
                <CardDescription>Frequently used scripts once the workspace is ready</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Development</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>`pnpm dev --filter zuba-api`</li>
                      <li>`pnpm storybook --filter ui-kit`</li>
                      <li>`pnpm test --filter zuba-web --watch`</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Automation</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>`pnpm secrets:pull` for environment sync</li>
                      <li>`pnpm db:migrate --env dev`</li>
                      <li>`pnpm deploy --filter zuba-web --env staging`</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5" />
                  Release Quality Gates
                </CardTitle>
                <CardDescription>
                  Criteria the platform group validates before approving a merge to main
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {qualityGates.map((gate) => (
                    <div key={gate.title} className="rounded-lg border border-border/40 bg-background/60 p-5 shadow-sm">
                      <h3 className="text-lg font-semibold">{gate.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {gate.bullets.map((bullet) => (
                          <li key={bullet}>• {bullet}</li>
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
                  <CloudCog className="size-5" />
                  Promote to Staging
                </CardTitle>
                <CardDescription>Automated pathway from dev to shared staging cluster</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Trigger the pipeline with <span className="font-mono">pnpm deploy --filter zuba-web --env staging</span>. The workflow provisions temporary feature flags, seeds partner data, and posts status updates into #zuba-launchpad.
                </p>
                <Button variant="secondary" className="w-fit">
                  View pipeline dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText className="size-5" />
                  Support Handoff
                </CardTitle>
                <CardDescription>Steps required before elevating changes to production</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Link Confluence runbook updates inside the release PR</li>
                  <li>• Record a five minute Loom walkthrough for support agents</li>
                  <li>• Capture new dashboards inside the Observability index</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
