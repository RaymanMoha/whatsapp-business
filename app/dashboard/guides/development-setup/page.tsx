import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, PlugZap, Workflow, ChartSpline } from "lucide-react"

const tooling = [
  {
    title: "Editor essentials",
    bullets: [
      "VS Code with GitHub Copilot and ESLint extensions",
      "Figma desktop for design QA",
      "Insomnia for API testing",
    ],
  },
  {
    title: "CLI utilities",
    bullets: [
      "pnpm 9 for monorepo management",
      "Docker Desktop with BuildKit",
      "Firebase CLI for ANSU emulators",
    ],
  },
  {
    title: "Browser tooling",
    bullets: [
      "Chrome Canary with React DevTools",
      "Edge for compatibility checks",
      "Accessibility insights extension",
    ],
  },
]

const dailyWorkflow = [
  {
    title: "Morning",
    description: "Pull latest changes, run pnpm install, review on-call updates in #platform-status",
  },
  {
    title: "Focus block",
    description: "Start feature branch, keep Cypress/Playwright watchers running for fast feedback",
  },
  {
    title: "Wrap-up",
    description: "Open draft PR with loom demo, post summary in project channel",
  },
]

const metrics = [
  {
    label: "10m",
    description: "Average time from clone to dev server for new engineers",
  },
  {
    label: "<1%",
    description: "Lint error rate across main branch",
  },
  {
    label: "2 hrs",
    description: "Expected time spent pairing per week during onboarding",
  },
]

export default function DevelopmentSetupGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Development Setup Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            Recommended setup for shipping confidently in the Reon Capital ecosystem. This page mirrors how the platform team configures workstations so newcomers stay aligned.
          </p>
        </div>

        <Tabs defaultValue="tooling" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tooling">Tooling</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="tooling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlugZap className="size-5" />
                  Workstation toolkit
                </CardTitle>
                <CardDescription>Install these before picking up your first task</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {tooling.map((group) => (
                  <div key={group.title} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {group.bullets.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="size-5" />
                  Daily rhythm
                </CardTitle>
                <CardDescription>How platform squads stay in sync</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyWorkflow.map((step) => (
                  <div key={step.title} className="rounded-lg border border-dashed border-primary/30 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartSpline className="size-5" />
                  Health metrics
                </CardTitle>
                <CardDescription>Benchmarks we watch to keep developer experience high</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-primary/5 p-5 text-center">
                    <div className="text-3xl font-bold text-primary">{metric.label}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>
                    <Badge variant="outline" className="mt-4">Target</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
