import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, GitBranch } from "lucide-react"

const repositoryGroups = [
  {
    name: "Platform Apps",
    description: "Core applications powering customer-facing experiences.",
    repos: [
      { label: "Developer Hub", url: "https://github.com/RaymanMoha/Dev", tag: "Next.js" },
      { label: "ENEVA Dashboard", url: "https://github.com/reon-capital/eneva-dashboard", tag: "React" },
      { label: "ZUBA Console", url: "https://github.com/reon-capital/zuba-console", tag: "Remix" },
    ],
  },
  {
    name: "Services",
    description: "APIs and background workers shared across products.",
    repos: [
      { label: "ANSU Core", url: "https://github.com/reon-dev/ansu-core", tag: "Node" },
      { label: "Partner Billing", url: "https://github.com/reon-capital/partner-billing", tag: "Go" },
    ],
  },
  {
    name: "Tooling",
    description: "Developer productivity tools, CLIs, and shared packages.",
    repos: [
      { label: "design-tokens", url: "https://github.com/reon-capital/design-tokens", tag: "Packages" },
      { label: "cli", url: "https://github.com/reon-capital/platform-cli", tag: "CLI" },
    ],
  },
]

export default function RepositoryResourcesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Repository Directory</h1>
          <p className="text-muted-foreground max-w-3xl">
            Central list of active repositories across Reon Capital. Bookmark this page and refer to the changelog for release status.
          </p>
        </div>

        <div className="space-y-6">
          {repositoryGroups.map((group) => (
            <Card key={group.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="size-5" />
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.repos.map((repo) => (
                  <div key={repo.label} className="flex flex-col gap-2 rounded-lg border border-border/40 bg-secondary/10 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium">{repo.label}</p>
                      <a
                        className="text-sm text-primary underline-offset-4 hover:underline"
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {repo.url}
                      </a>
                    </div>
                    <Badge variant="secondary" className="w-fit md:w-auto">{repo.tag}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
