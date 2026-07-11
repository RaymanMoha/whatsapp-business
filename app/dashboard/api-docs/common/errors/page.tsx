import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bug, LifeBuoy, Workflow } from "lucide-react"

const errorMatrix = [
  { code: "400_BAD_REQUEST", meaning: "Request validation failed", fix: "Verify payload schema and required fields" },
  { code: "401_UNAUTHORIZED", meaning: "Missing or invalid token", fix: "Refresh access token or confirm scopes" },
  { code: "403_FORBIDDEN", meaning: "Authenticated but lacking permission", fix: "Request additional scopes or tenant access" },
  { code: "404_NOT_FOUND", meaning: "Resource missing", fix: "Confirm identifiers and environment" },
  { code: "409_CONFLICT", meaning: "State conflict during update", fix: "Retry with the latest version token" },
  { code: "429_TOO_MANY_REQUESTS", meaning: "Rate limit exceeded", fix: "Backoff according to retry headers" },
  { code: "500_INTERNAL_ERROR", meaning: "Unexpected server error", fix: "Retry and escalate with request id" },
]

const troubleshooting = [
  {
    title: "Capture request ids",
    description: "Every response includes `x-reon-request-id`. Provide it when opening support tickets so we can trace logs instantly.",
  },
  {
    title: "Use sandbox headers",
    description: "Append `x-reon-sandbox: true` to simulate failures safely during integration testing.",
  },
  {
    title: "Enable verbose logging",
    description: "Set `REON_DEBUG=1` in local clients to print retry headers and validation messages.",
  },
]

const escalation = [
  "Open a Jira ticket using the API Incident template",
  "Drop a note in #platform-support with the request id",
  "Page on-call via PagerDuty for P0 incidents",
]

export default function CommonApiErrorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Error Handling Guide</h1>
          <p className="text-muted-foreground max-w-3xl">
            Standardised errors across Reon APIs ensure partners never feel lost. Use the matrix, troubleshooting steps, and escalation checklist whenever something goes wrong.
          </p>
        </div>

        <Tabs defaultValue="matrix" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matrix">Error Matrix</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            <TabsTrigger value="escalation">Escalation</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Common responses
                </CardTitle>
                <CardDescription>Applies to ENEVA, ZUBA, BEZZA, and shared services</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Meaning</TableHead>
                      <TableHead>Next step</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorMatrix.map((entry) => (
                      <TableRow key={entry.code}>
                        <TableCell className="font-mono text-xs">{entry.code}</TableCell>
                        <TableCell>{entry.meaning}</TableCell>
                        <TableCell>{entry.fix}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="size-5" />
                  Troubleshooting playbook
                </CardTitle>
                <CardDescription>Quick steps to identify root causes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {troubleshooting.map((item) => (
                    <li key={item.title}>
                      <span className="font-semibold text-foreground">{item.title}:</span> {item.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escalation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="size-5" />
                  Escalation checklist
                </CardTitle>
                <CardDescription>Follow this order when production issues occur</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  {escalation.map((step) => (
                    <li key={step}>- {step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="size-5" />
                  Automated retries
                </CardTitle>
                <CardDescription>Understand how Reon services retry failed requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ENEVA and ZUBA gateway clients retry 409 and 500 responses up to three times with exponential backoff (250 ms, 1 s, 5 s). If you return a 4xx code, no retries occur. Use `Retry-After` headers to communicate custom backoff windows.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
