import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MonitorSmartphone, Cpu, HardDrive, GlobeLock, Rocket, CloudLightning } from "lucide-react"

const workstationMatrix = [
  {
    role: "Frontend",
    specs: [
      "MacOS 14.5+ or Windows 11",
      "16 GB RAM minimum",
      "Chrome, Safari Tech Preview, and Edge",
    ],
    tooling: ["Node.js 20", "pnpm 9", "Playwright"],
  },
  {
    role: "Backend",
    specs: [
      "Docker Desktop with 4 CPUs",
      "kubectl and helm 3",
      "gcloud CLI for platform access",
    ],
    tooling: ["Go 1.22", "pnpm 9", "Firebase CLI"],
  },
  {
    role: "Design & QA",
    specs: [
      "Figma desktop app",
      "Chromatic CLI",
      "Lighthouse CI",
    ],
    tooling: ["Storybook", "Chromatic", "BrowserStack"],
  },
]

const securityPractices = [
  "Enable hardware backed MFA on the Reon Capital Okta tenant",
  "Install 1Password for secrets distribution and rotation",
  "Keep device encryption enabled (FileVault or BitLocker)",
  "Run weekly `pnpm audit` and Snyk scans before merges",
]

const cloudAccess = [
  {
    name: "Reon Cloud Console",
    description: "Primary entry point for Kubernetes clusters, BigQuery datasets, and secret mounts",
    action: "Request access through #platform-access channel",
  },
  {
    name: "Vercel Projects",
    description: "All Next.js apps (Dashboard, marketing, ZUBA web) are managed here",
    action: "Ask the web platform team for deploy previews scopes",
  },
  {
    name: "Firebase Console",
    description: "ANSU auth and Firestore environments",
    action: "Use service account credentials pulled via `pnpm secrets:pull`",
  },
]

export default function GettingStartedEnvironmentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Development Environment</h1>
          <p className="text-muted-foreground max-w-3xl">
            Everything you need to align your workstation with Reon Capital standards. Follow the tabs to prepare hardware, security, and cloud access without falling into missing documentation routes.
          </p>
        </div>

        <Tabs defaultValue="workstation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workstation">Workstation</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Access</TabsTrigger>
          </TabsList>

          <TabsContent value="workstation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorSmartphone className="size-5" />
                  Recommended Specs
                </CardTitle>
                <CardDescription>Baseline setup per discipline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {workstationMatrix.map((entry) => (
                    <div key={entry.role} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{entry.role}</h3>
                        <Badge variant="outline">Core</Badge>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {entry.specs.map((spec) => (
                          <li key={spec}>• {spec}</li>
                        ))}
                      </ul>
                      <div className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Tooling</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.tooling.map((tool) => (
                          <Badge key={tool} variant="secondary">{tool}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GlobeLock className="size-5" />
                  Security Baseline
                </CardTitle>
                <CardDescription>Keep customer and partner data safe from day one</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {securityPractices.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="size-5" />
                  Local Services
                </CardTitle>
                <CardDescription>Tools we run locally to mirror platform services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Firebase Emulators</h4>
                    <p className="mt-2 text-sm text-muted-foreground">Run <span className="font-mono">pnpm firebase:emulators</span> to simulate auth, Firestore, and storage for ANSU features.</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h4 className="font-semibold">Edge sandbox</h4>
                    <p className="mt-2 text-sm text-muted-foreground">Use <span className="font-mono">pnpm dev --filter dashboard</span> with the <span className="font-mono">--experimental-edge</span> flag to test middleware locally.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cloud" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudLightning className="size-5" />
                  Cloud Accounts
                </CardTitle>
                <CardDescription>Where each Reon project is deployed and how to gain access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {cloudAccess.map((resource) => (
                    <div key={resource.name} className="rounded-lg border border-dashed border-primary/30 p-5">
                      <h3 className="text-lg font-semibold">{resource.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-primary">{resource.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="size-5" />
                  Next Steps
                </CardTitle>
                <CardDescription>Once your environment is ready, head to the setup guide</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Continue with the project setup wizard to clone repositories, install dependencies, and run the dashboard locally.
                </p>
                <Button asChild>
                  <a href="/dashboard/getting-started/setup">Open setup checklist</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
