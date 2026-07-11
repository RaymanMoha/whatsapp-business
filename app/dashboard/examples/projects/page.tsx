import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Boxes, Globe2, LayoutDashboard } from "lucide-react"

const sampleProjects = [
  {
    name: "Developer Hub",
    stack: ["Next.js 15", "Turbopack", "Tailwind"],
    description: "Reference implementation for authenticated dashboards with role-based navigation and rich content tabs.",
    repo: "https://github.com/RaymanMoha/Dev",
    icon: LayoutDashboard,
  },
  {
    name: "ENEVA API Reference",
    stack: ["Node.js", "tRPC", "PostgreSQL"],
    description: "End-to-end API project featuring rate limiting, feature flags, and document generation.",
    repo: "https://github.com/reon-capital/eneva-api-reference",
    icon: Globe2,
  },
  {
    name: "Partner Launch Kit",
    stack: ["Next.js", "Edge Functions", "Lucia"],
    description: "Ready-to-deploy starter for partners integrating ZUBA and BEZZA services in record time.",
    repo: "https://github.com/reon-capital/partner-launch-kit",
    icon: Boxes,
  },
]

export default function SampleProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Sample Projects</h1>
          <p className="text-muted-foreground max-w-3xl">
            Jump-start new initiatives with production-ready examples that mirror how the Reon Capital platform teams structure codebases.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sampleProjects.map((project) => {
            const Icon = project.icon
            return (
              <Card key={project.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="size-5" />
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <a
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View repository
                    <ArrowUpRight className="size-4" />
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
