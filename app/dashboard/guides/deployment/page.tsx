import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Rocket, GitBranch, ShieldAlert, CloudUpload, LifeBuoy } from "lucide-react"

const deploymentStages = [
  {
    name: "Preview",
    description: "Every pull request deploys to Vercel preview with automated visual tests",
  },
  {
    name: "Staging",
    description: "Nightly promotion triggered via GitHub Actions using release branches",
  },
  {
    name: "Production",
    description: "Manual approval required with dual sign-off from engineering and support",
  },
]

const verificationChecklist = [
  "Playwright smoke suite passes on preview URL",
  "Datadog monitors report green for the last 30 minutes",
  "Changelog entry drafted and attached to release ticket",
  "Support announcement scheduled in #dev-hub-updates",
]

const rollbackPlan = [
  "Toggle feature flag or env var if change is behind a guard",
  "Trigger GitHub Action `deploy:rollback` for the impacted app",
  "Restore database snapshot if schema migrations were applied",
  "Document root cause and resolution in #platform-postmortems",
]

export default function DeploymentGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Deployment Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            End-to-end path from pull request to production. Follow these steps for the Developer Hub, ENEVA, ZUBA, and BEZZA deployments.
          </p>
        </div>

        <Tabs defaultValue="stages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stages">Stages</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="rollback">Rollback</TabsTrigger>
          </TabsList>

          <TabsContent value="stages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="size-5" />
                  Promotion stages
                </CardTitle>
                <CardDescription>Consistent across all teams</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {deploymentStages.map((stage) => (
                  <div key={stage.name} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{stage.name}</h3>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudUpload className="size-5" />
                  Verification checklist
                </CardTitle>
                <CardDescription>Complete before approving production deploys</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {verificationChecklist.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rollback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-5" />
                  Rollback steps
                </CardTitle>
                <CardDescription>Follow in order to minimise downtime</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  {rollbackPlan.map((step) => (
                    <li key={step}>- {step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="size-5" />
                  Communications
                </CardTitle>
                <CardDescription>Who to alert during incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Page on-call via PagerDuty for P0 incidents, notify #platform-support, and ping product managers in the relevant project channel. Capture all events in the incident timeline document stored in Notion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="size-5" />
                  Branch hygiene
                </CardTitle>
                <CardDescription>Keep release branches clean and traceable</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tag production releases with <span className="font-mono">release-YYYY-MM-DD</span>. Merge hotfixes into both the release branch and develop to avoid drift.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
