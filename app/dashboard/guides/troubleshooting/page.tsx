import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bug, Server, TerminalSquare, Wrench } from "lucide-react"

const incidentPlaybooks = [
  {
    title: "API latency spike",
    steps: [
      "Check Grafana dashboard `eneva-latency` for P95 trends",
      "Inspect recent deploys in Vercel; rollback if deployed in last 30 minutes",
      "Run k6 smoke test against `/api/chat` to confirm response profile",
      "Escalate to platform on-call if latency > 1.5s for 15 minutes",
    ],
  },
  {
    title: "Auth failures",
    steps: [
      "Verify Auth0 status page and tenant logs",
      "Flush stale sessions via Redis command `DEL disruptortwo:sessions:*`",
      "Re-run Playwright login flow using `pnpm test:auth`",
      "Notify support to post message in #customer-updates",
    ],
  },
  {
    title: "Chat completions timeout",
    steps: [
      "Confirm OpenAI rate limits in Azure portal",
      "Switch feature flag `chatStreamingFallback` to true",
      "Queue backlog replay with `pnpm task queue:retry chat`",
      "File incident doc and capture error IDs from Sentry",
    ],
  },
]

const debuggingTools = [
  {
    name: "Sentry",
    description: "Search for error IDs referenced in UI toast notifications",
    command: "SENTRY_ORG=disruptortwo pnpm sentry:open",
  },
  {
    name: "Vercel CLI",
    description: "Tail serverless function logs for the dashboard",
    command: "pnpm vercel logs disruptortwo-dashboard --since=1h",
  },
  {
    name: "Azure Monitor",
    description: "Inspect ENEVA ingestion pipeline metrics",
    command: "az monitor metrics list --resource eneva-pipeline --metric Requests",
  },
]

const knowledgeBaseLinks = [
  {
    label: "Playwright flaky test guide",
    href: "https://notion.so/disruptortwo/playwright-flaky-tests",
  },
  {
    label: "Rate limit runbook",
    href: "https://notion.so/disruptortwo/rate-limit-runbook",
  },
  {
    label: "Auth0 tenant status",
    href: "https://status.auth0.com/",
  },
]

export default function TroubleshootingGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Troubleshooting Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            Quick references for the most common incidents affecting the Developer Hub and satellite experiences. Pair this with the deployment guide for on-call readiness.
          </p>
        </div>

        <Tabs defaultValue="playbooks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
            <TabsTrigger value="tooling">Tooling</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

        <TabsContent value="playbooks" className="space-y-6">
            {incidentPlaybooks.map((playbook) => (
              <Card key={playbook.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="size-5" />
                    {playbook.title}
                  </CardTitle>
                  <CardDescription>Work through steps in order</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    {playbook.steps.map((step) => (
                      <li key={step}>- {step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tooling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="size-5" />
                  Debugging utilities
                </CardTitle>
                <CardDescription>Commands you can run locally</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {debuggingTools.map((tool) => (
                  <div key={tool.name} className="rounded-lg border border-border/40 bg-secondary/10 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TerminalSquare className="size-4" />
                        {tool.name}
                      </h3>
                      <Badge variant="outline">CLI</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>
                    <code className="mt-4 block select-all rounded bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                      {tool.command}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="references" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="size-5" />
                  Knowledge base
                </CardTitle>
                <CardDescription>Bookmark these for on-call shifts</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {knowledgeBaseLinks.map((link) => (
                    <li key={link.href}>
                      <a className="text-primary underline-offset-4 hover:underline" href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="size-5" />
                  Sentry triage labels
                </CardTitle>
                <CardDescription>Ensure issues are tagged correctly</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  - <Badge variant="secondary">platform-regression</Badge> for bugs introduced within the past release.
                </p>
                <p>
                  - <Badge variant="secondary">customer-impact</Badge> when the issue blocks a paying tenant. Ping CSM immediately.
                </p>
                <p>
                  - <Badge variant="secondary">needs-root-cause</Badge> when additional investigation is required before closing the incident.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
