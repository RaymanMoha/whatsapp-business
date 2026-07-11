import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListTree, Server, Activity, CreditCard, ShieldAlert } from "lucide-react"

const customerEndpoints = [
  { method: "GET", path: "/api/customers", description: "List customers with pagination and filters" },
  { method: "POST", path: "/api/customers", description: "Create a new customer and assign meters" },
  { method: "GET", path: "/api/customers/:id", description: "Fetch customer profile and active services" },
  { method: "PATCH", path: "/api/customers/:id", description: "Update customer contact details" },
]

const meterEndpoints = [
  { method: "POST", path: "/api/meters", description: "Register a new meter and link to transformer" },
  { method: "POST", path: "/api/meters/:id/readings", description: "Submit meter reading payload" },
  { method: "GET", path: "/api/meters/:id/history", description: "Retrieve historical consumption data" },
]

const billingEndpoints = [
  { method: "POST", path: "/api/billing/run", description: "Generate monthly bills for all customers" },
  { method: "POST", path: "/api/billing/:id/recalculate", description: "Recalculate a single bill after adjustments" },
  { method: "GET", path: "/api/billing/:id", description: "Fetch bill details including payment timeline" },
  { method: "POST", path: "/api/payments", description: "Record a payment against a bill" },
]

const webhooks = [
  {
    event: "billing.generated",
    payload: "Bill summary, customer id, consumption snapshot",
  },
  {
    event: "payment.settled",
    payload: "Payment id, bill id, reconciled amount",
  },
  {
    event: "meter.alert",
    payload: "Meter id, alert type, recommended action",
  },
]

export default function EnevaApiEndpointsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ENEVA API Endpoints</h1>
          <p className="text-muted-foreground max-w-3xl">
            A curated catalogue of the ENEVA REST API grouped by domain. Each section includes HTTP method, path, and a concise description so partners can self-serve without hitting dead links.
          </p>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="meters">Meters</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="size-5" />
                  Customer Endpoints
                </CardTitle>
                <CardDescription>Operations around profiles, accounts, and service assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customerEndpoints.map((endpoint) => (
                  <div key={endpoint.path} className="rounded-lg border border-border/40 bg-primary/5 p-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{endpoint.method}</Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  Meter Endpoints
                </CardTitle>
                <CardDescription>Manage meter lifecycle and consumption data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meterEndpoints.map((endpoint) => (
                  <div key={endpoint.path} className="rounded-lg border border-dashed border-primary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{endpoint.method}</Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  Billing & Payments
                </CardTitle>
                <CardDescription>Generate invoices and reconcile payments programmatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {billingEndpoints.map((endpoint) => (
                  <div key={endpoint.path} className="rounded-lg bg-primary/5 p-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{endpoint.method}</Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTree className="size-5" />
                  Webhook Catalogue
                </CardTitle>
                <CardDescription>Real time notifications emitted by ENEVA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {webhooks.map((hook) => (
                  <div key={hook.event} className="rounded-lg border border-border/40 bg-background/60 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{hook.event}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Payload: {hook.payload}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-5" />
                  Webhook Security
                </CardTitle>
                <CardDescription>Verify integrity before processing events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Validate <span className="font-mono">x-eneva-signature</span> header using your shared secret</li>
                  <li>• Reject events older than five minutes to prevent replay attacks</li>
                  <li>• Respond with 2xx status codes to avoid automatic retries</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
