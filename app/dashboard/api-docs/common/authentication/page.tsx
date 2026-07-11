import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KeySquare, LockKeyhole, Shield, Component, ScrollText } from "lucide-react"

const sharedPrinciples = [
  "OAuth 2.1 with JWT bearer tokens for machine clients",
  "Signed cookies for dashboard sessions (rotated every 12 hours)",
  "API keys only for legacy webhooks, sunset planned Q1 2026",
]

const authProviders = [
  {
    name: "Okta Workforce",
    description: "Internal Reon accounts with enforced MFA",
    notes: "Used for Developer Hub and admin consoles",
  },
  {
    name: "Custom partner SSO",
    description: "SAML and OIDC federation for partner organisations",
    notes: "Supports automatic user provisioning via SCIM",
  },
  {
    name: "Device trust",
    description: "Hardware attestation for mobile field devices",
    notes: "Required for ANSU core mobile app",
  },
]

const refresher = `POST /api/auth/refresh
Authorization: Bearer <refresh_token>
Content-Type: application/json

{
  "tenant": "eneva",
  "scopes": ["customers:read"]
}`

export default function CommonApiAuthenticationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Common Authentication Patterns</h1>
          <p className="text-muted-foreground max-w-3xl">
            Reon APIs share the same authentication backbone regardless of product. This page captures the default rules so you have a single place to reference when building shared tooling.
          </p>
        </div>

        <Tabs defaultValue="principles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="principles">Principles</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="refresh">Refresh</TabsTrigger>
          </TabsList>

          <TabsContent value="principles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Platform-wide rules
                </CardTitle>
                <CardDescription>Applies to ENEVA, ZUBA, BEZZA, and future services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {sharedPrinciples.map((principle) => (
                    <li key={principle}>• {principle}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Component className="size-5" />
                  Authentication providers
                </CardTitle>
                <CardDescription>Federated identity that powers the Reon ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authProviders.map((provider) => (
                  <div key={provider.name} className="rounded-lg border border-border/40 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <Badge variant="outline">Supported</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{provider.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-primary">{provider.notes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refresh" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeySquare className="size-5" />
                  Token refresh flow
                </CardTitle>
                <CardDescription>Applies to all public Reon APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{refresher}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="size-5" />
                  Rotation cadence
                </CardTitle>
                <CardDescription>Operational checklist for rotating refresh tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Rotate refresh tokens every 30 days or immediately after suspicion of compromise</li>
                  <li>• Store long lived credentials inside HashiCorp Vault</li>
                  <li>• Notify the platform security channel when rotating partner credentials</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="size-5" />
                  Compliance requirements
                </CardTitle>
                <CardDescription>Records we maintain for audits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All authentication events are logged to BigQuery with a seven year retention policy. Privacy requests are processed via the governance team and mirrored inside the Reon Developer Hub.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
