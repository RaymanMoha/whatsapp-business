import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, ShieldCheck, KeyRound, DatabaseZap, ClipboardList } from "lucide-react"

const grantTypes = [
  {
    name: "Client Credentials",
    description: "Server-to-server flows for operational tooling",
    steps: [
      "POST /api/oauth/token with client_id and client_secret",
      "Receive access_token scoped to organisation",
      "Use token in Authorization header for 15 minutes",
    ],
  },
  {
    name: "Authorization Code",
    description: "Primary flow for dashboard and partner apps",
    steps: [
      "Redirect users to /auth/authorize",
      "Exchange the returned code for tokens",
      "Refresh tokens using /auth/refresh endpoint",
    ],
  },
  {
    name: "Service Accounts",
    description: "Background jobs triggered via Cloud Functions",
    steps: [
      "Generate signed JWT with service credentials",
      "Exchange JWT for access token",
      "Rotate keys every 30 days via automation",
    ],
  },
]

const tokenShape = `{
  "access_token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "token_type": "Bearer",
  "refresh_token": "RfP5DLK...",
  "scope": "customers:read meters:write"
}`

const scopes = [
  {
    name: "customers:read",
    description: "View customer profiles, billing history, and meter assignments",
  },
  {
    name: "customers:write",
    description: "Create or update customer records and metadata",
  },
  {
    name: "billing:manage",
    description: "Trigger bill generation and adjust payment statuses",
  },
  {
    name: "analytics:read",
    description: "Query aggregated reporting datasets",
  },
]

export default function EnevaApiAuthenticationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ENEVA API Authentication</h1>
          <p className="text-muted-foreground max-w-3xl">
            Secure access to ENEVA services is enforced through OAuth 2.1 with signed JWTs. Use this page to understand client registration, token issuance, and scope management.
          </p>
        </div>

        <Tabs defaultValue="flows" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flows">Auth Flows</TabsTrigger>
            <TabsTrigger value="tokens">Token Format</TabsTrigger>
            <TabsTrigger value="scopes">Scopes</TabsTrigger>
          </TabsList>

          <TabsContent value="flows" className="space-y-6">
            {grantTypes.map((flow) => (
              <Card key={flow.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5" />
                    {flow.name}
                  </CardTitle>
                  <CardDescription>{flow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    {flow.steps.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="size-5" />
                  Token Response
                </CardTitle>
                <CardDescription>Typical payload returned by the token endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{tokenShape}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="size-5" />
                  Refresh Rotation
                </CardTitle>
                <CardDescription>Best practices for long lived sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Refresh tokens expire after 30 days or sooner when revoked</li>
                  <li>• Call <span className="font-mono">POST /api/oauth/rotate</span> to cycle secrets programmatically</li>
                  <li>• Store tokens in encrypted secret stores, never in source control</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scopes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DatabaseZap className="size-5" />
                  Scope Catalog
                </CardTitle>
                <CardDescription>Targeted access control for partner integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {scopes.map((scope) => (
                    <div key={scope.name} className="rounded-lg border border-border/40 bg-primary/5 p-4">
                      <Badge variant="outline">{scope.name}</Badge>
                      <p className="mt-2 text-sm text-muted-foreground">{scope.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-5" />
                  Registration Checklist
                </CardTitle>
                <CardDescription>Steps to onboard a new partner client</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Submit partner domain and callback URLs for validation</li>
                  <li>• Define required scopes per environment (sandbox, staging, prod)</li>
                  <li>• Capture support escalation details inside the partner registry</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
