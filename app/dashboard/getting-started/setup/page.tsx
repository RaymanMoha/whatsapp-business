import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Milestone } from "lucide-react"

const repoChecklist = [
  {
    name: "Developer Hub",
    command: "git clone git@github.com:RaymanMoha/Dev.git",
    notes: "The dashboard you are browsing. Uses Next.js 15 with Turbopack",
  },
  {
    name: "ANSU Platform",
    command: "git clone git@bitbucket.org:reon-dev/ansu.git",
    notes: "Enterprise energy platform powering internal teams",
  },
  {
    name: "ZUBA Platform",
    command: "git clone git@github.com:reon-capital/zuba-suite.git",
    notes: "Modular banking experience for partners",
  },
]

const workspaceCommands = [
  {
    label: "Install dependencies",
    command: "pnpm install",
  },
  {
    label: "Run dashboard locally",
    command: "pnpm dev",
  },
  {
    label: "Execute lint checks",
    command: "pnpm lint",
  },
  {
    label: "Run component tests",
    command: "pnpm test -- --watch",
  },
]

const onboardingMilestones = [
  {
    title: "Day 1",
    items: [
      "Complete workstation setup from the environment page",
      "Clone repositories listed below",
      "Join Slack channels: #dev-hub, #ansu-platform, #zuba-core",
    ],
  },
  {
    title: "Day 3",
    items: [
      "Ship a small content update via pull request",
      "Walk through feature flag creation with a teammate",
      "Add yourself to the support rotation calendar",
    ],
  },
  {
    title: "Day 7",
    items: [
      "Participate in a production deploy shadow",
      "Rotate API keys using the secrets automation",
      "Document learnings inside the onboarding journal",
    ],
  },
]

export default function GettingStartedSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Project Setup Checklist</h1>
          <p className="text-muted-foreground max-w-3xl">
            Move from a clean laptop to contributing across Reon projects. This guide keeps everything in one place so you never land on a 404 while onboarding.
          </p>
        </div>

        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clone the core workspaces</CardTitle>
                <CardDescription>These repositories cover the dashboard, platform apps, and shared packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {repoChecklist.map((repo) => (
                  <div key={repo.name} className="rounded-lg border border-border/40 bg-primary/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{repo.name}</h3>
                        <p className="text-sm text-muted-foreground">{repo.notes}</p>
                      </div>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    <pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-sm">{repo.command}</pre>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace commands</CardTitle>
                <CardDescription>Standard scripts that keep every project consistent</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {workspaceCommands.map((command) => (
                  <div key={command.label} className="rounded-lg border border-dashed border-primary/30 p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">{command.label}</h4>
                    <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-sm">{command.command}</pre>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next actions</CardTitle>
                <CardDescription>Jump straight into feature work once the workspace is healthy</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Ready to contribute? Pick a starter issue from the Developer Hub project board or pair with another engineer for your first deployment.
                </p>
                <Button asChild>
                  <a href="/dashboard/projects/eneva">Explore active projects</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milestone className="size-5" />
                  Onboarding milestones
                </CardTitle>
                <CardDescription>Track your first week within the platform organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {onboardingMilestones.map((milestone) => (
                    <div key={milestone.title} className="rounded-lg border border-border/40 bg-background/60 p-5">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {milestone.items.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
