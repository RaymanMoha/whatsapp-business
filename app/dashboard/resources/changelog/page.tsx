import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const releases = [
  {
    version: "2025.10.2",
    date: "2025-10-15",
    highlights: "Added Developer Guides, improved navigation search, refreshed ENEVA benchmarks.",
    type: "Feature",
  },
  {
    version: "2025.09.1",
    date: "2025-09-28",
    highlights: "Introduced rate limit observability dashboard and API docs refresh.",
    type: "Improvement",
  },
  {
    version: "2025.08.3",
    date: "2025-08-12",
    highlights: "Hotfix for partner SSO callback bug and chat assistant reliability.",
    type: "Hotfix",
  },
]

export default function ChangelogPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Changelog</h1>
          <p className="text-muted-foreground max-w-3xl">
            Track the latest releases across the Developer Hub and connected platform services. Subscribe to updates from the support page to receive alerts in Slack.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Release history</CardTitle>
            <CardDescription>Summaries of production deployments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((release) => (
                  <TableRow key={release.version}>
                    <TableCell className="font-medium">{release.version}</TableCell>
                    <TableCell>{release.date}</TableCell>
                    <TableCell>{release.highlights}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{release.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
