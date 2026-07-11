import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardCheck, Laptop, Layers, TerminalSquare, Zap, LifeBuoy, FolderDown } from "lucide-react"

const workspaceSetup = [
  {
    title: "Clone toolkit",
    command: "git clone git@github.com:reon-capital/bezza-monorepo.git && cd bezza-monorepo",
    description: "Pulls Turborepo workspace containing web, worker, and packages folders",
  },
  {
    title: "Install & verify",
    command: "pnpm install && pnpm lint",
    description: "Installs workspace dependencies and confirms linting baselines",
  },
  {
    title: "Seed data",
    command: "pnpm seed --env local",
    description: "Populates demo data (products, customers, marketing campaigns)",
  },
]

const environmentMatrix = [
  {
    name: "Local",
    icon: <Laptop className="size-4" />,
    details: [
      "Runs via `pnpm dev` with mocked services",
      "Edge routes proxied using Next dev server",
      "Local SQLite snapshot for quick QA",
    ],
  },
  {
    name: "Staging",
    icon: <Layers className="size-4" />,
    details: [
      "Deploy with `pnpm deploy --filter web --env staging`",
      "Connects to shared Postgres read replica",
      "Storybook published to internal portal",
    ],
  },
  {
    name: "Production",
    icon: <Zap className="size-4" />,
    details: [
      "Blue/green rollouts orchestrated via GitHub Actions",
      "Synthetic monitors attached to every route",
      "Traffic mirrored for five minutes before cutover",
    ],
  },
]

const supportChecklist = [
  "Create support macros within Intercom inbox",
  "Publish changelog entry once deployment completes",
  "Update launch calendar event with rollout notes",
]

export default function BezzaSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">BEZZA Setup Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            A lightweight checklist for designers, engineers, and support agents bringing a new BEZZA site online. Follow each tab to move from local development to production rollout without hitting 404 dead ends.
          </p>
        </div>

        <Tabs defaultValue="workspace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="handoff">Handoff</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="space-y-6">
            {workspaceSetup.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TerminalSquare className="size-5" />
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">{step.command}</div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="environments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="size-5" />
                  Environment Matrix
                </CardTitle>
                <CardDescription>Understand what changes between local, staging, and production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {environmentMatrix.map((environment) => (
                    <div key={environment.name} className="rounded-lg border border-border/40 bg-background/60 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {environment.icon}
                        <span>{environment.name}</span>
                        <Badge variant="outline" className="ml-auto">Ready</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {environment.details.map((detail) => (
                          <li key={detail}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="handoff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="size-5" />
                  Support Enablement
                </CardTitle>
                <CardDescription>Complete these items before handing builds to the success team</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {supportChecklist.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderDown className="size-5" />
                  Artifact Bundle
                </CardTitle>
                <CardDescription>Generate the package engineers attach to release tickets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Run <span className="font-mono">pnpm build --filter web</span> followed by <span className="font-mono">pnpm export:assets</span>. Upload the generated bundle from <span className="font-mono">/out</span> into the release ticket so QA and support can validate content without pulling the repo.
                </p>
                <Button variant="secondary" className="w-fit">View release template</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
