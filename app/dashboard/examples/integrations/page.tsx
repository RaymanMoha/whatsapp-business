import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Database, Globe, Lock } from "lucide-react"

const integrations = [
  {
    id: "crm",
    label: "CRM",
    summary: "Sync customer health metrics from ENEVA to HubSpot in near real time.",
    steps: [
      "Create an API key in HubSpot with read and write permissions",
      "Configure the ENEVA webhook endpoint `/api/integrations/hubspot`",
      "Map payload fields using the provided TypeScript utility",
      "Schedule nightly reconciliation via GitHub Actions",
    ],
    badge: "Recommended",
    icon: Globe,
  },
  {
    id: "data-warehouse",
    label: "Data Warehouse",
    summary: "Stream usage analytics into BigQuery for shared dashboards.",
    steps: [
      "Provision a service account with insert privileges",
      "Deploy the `warehouse-sync` package to the shared worker",
      "Confirm event schemas by running `pnpm integration:validate`",
      "Enable Looker Studio dashboard alerts for anomalies",
    ],
    badge: "Analytics",
    icon: Database,
  },
  {
    id: "sso",
    label: "SSO",
    summary: "Connect enterprise tenants to Auth0 for seamless authentication.",
    steps: [
      "Add the partner domain to the allow list inside Auth0",
      "Generate signing certificates and store them in Azure Key Vault",
      "Configure callback URLs in the Developer Hub settings page",
      "Test login using `pnpm auth:test --tenant` before launch",
    ],
    badge: "Security",
    icon: Lock,
  },
]

export default function IntegrationExamplesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Integration Examples</h1>
          <p className="text-muted-foreground max-w-3xl">
            Production-ready integration flows pairing the Developer Hub with partner systems. Each recipe references code stored in the sample projects section.
          </p>
        </div>

        <Tabs defaultValue={integrations[0]?.id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {integrations.map((integration) => (
              <TabsTrigger key={integration.id} value={integration.id}>
                {integration.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <TabsContent key={integration.id} value={integration.id}>
                <Card>
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="size-5" />
                        {integration.label}
                      </CardTitle>
                      <CardDescription>{integration.summary}</CardDescription>
                    </div>
                    <Badge variant="secondary">{integration.badge}</Badge>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal space-y-3 pl-6 text-sm text-muted-foreground">
                      {integration.steps.map((step) => (
                        <li key={step} className="flex items-start gap-2">
                          <ArrowRight className="mt-1 size-4 text-primary" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
