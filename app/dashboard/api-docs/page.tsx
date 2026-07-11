import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Code, FileText, Zap, Shield, Database, Webhook } from "lucide-react"
import Link from "next/link"

export default function ApiDocsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Complete reference for all Reon Capital APIs
          </p>
        </div>

        <div className="grid gap-6">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="size-5 text-yellow-600" />
                  REST API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  RESTful endpoints for all core operations
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="secondary">JSON</Badge>
                  <Badge variant="secondary">HTTP/HTTPS</Badge>
                  <Badge variant="secondary">Rate Limited</Badge>
                </div>
                <Link href="/dashboard/api-docs/rest">
                  <Button size="sm" className="w-full">Explore REST API</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="size-5 text-blue-600" />
                  GraphQL API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Flexible queries with GraphQL schema
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="secondary">Schema</Badge>
                  <Badge variant="secondary">Introspection</Badge>
                  <Badge variant="secondary">Subscriptions</Badge>
                </div>
                <Link href="/dashboard/api-docs/graphql">
                  <Button size="sm" className="w-full">Explore GraphQL</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Webhook className="size-5 text-green-600" />
                  Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Real-time notifications and events
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="secondary">Events</Badge>
                  <Badge variant="secondary">Signatures</Badge>
                  <Badge variant="secondary">Retries</Badge>
                </div>
                <Link href="/dashboard/api-docs/webhooks">
                  <Button size="sm" className="w-full">Setup Webhooks</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* API Reference */}
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Browse endpoints by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="authentication" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="data">Data Services</TabsTrigger>
                  <TabsTrigger value="admin">Administration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="authentication" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">POST /auth/token</CardTitle>
                          <Badge className="bg-green-100 text-green-800">Authentication</Badge>
                        </div>
                        <CardDescription>
                          Generate an access token using API key
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X POST https://api.reoncapital.com/auth/token \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                          </code>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">POST /auth/refresh</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">Authentication</Badge>
                        </div>
                        <CardDescription>
                          Refresh an existing access token
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X POST https://api.reoncapital.com/auth/refresh \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer REFRESH_TOKEN"
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">GET /users</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">Users</Badge>
                        </div>
                        <CardDescription>
                          Retrieve a list of users
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X GET https://api.reoncapital.com/users \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer ACCESS_TOKEN"
                          </code>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">GET /users/:id</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">Users</Badge>
                        </div>
                        <CardDescription>
                          Retrieve a specific user by ID
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X GET https://api.reoncapital.com/users/123 \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer ACCESS_TOKEN"
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">GET /data/analytics</CardTitle>
                          <Badge className="bg-purple-100 text-purple-800">Data</Badge>
                        </div>
                        <CardDescription>
                          Retrieve analytics data
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X GET https://api.reoncapital.com/data/analytics \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer ACCESS_TOKEN" \<br/>
                            &nbsp;&nbsp;-G -d "start_date=2024-01-01" -d "end_date=2024-12-31"
                          </code>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">POST /data/reports</CardTitle>
                          <Badge className="bg-purple-100 text-purple-800">Data</Badge>
                        </div>
                        <CardDescription>
                          Generate a custom report
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X POST https://api.reoncapital.com/data/reports \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer ACCESS_TOKEN" \<br/>
                            &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                            &nbsp;&nbsp;-d '{`{"type": "financial", "format": "pdf"}`}'
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">GET /admin/stats</CardTitle>
                          <Badge className="bg-red-100 text-red-800">Admin</Badge>
                        </div>
                        <CardDescription>
                          Get system statistics (Admin only)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <code className="text-sm">
                            curl -X GET https://api.reoncapital.com/admin/stats \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer ADMIN_TOKEN"
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Rate Limits & Authentication */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API requests require authentication using Bearer tokens.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm">
                    Authorization: Bearer YOUR_ACCESS_TOKEN
                  </code>
                </div>
                <Link href="/dashboard/getting-started/authentication">
                  <Button variant="outline" size="sm">
                    Learn more about authentication
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  API requests are rate limited to ensure fair usage.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Standard:</span>
                    <span>1000 req/hour</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Premium:</span>
                    <span>5000 req/hour</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Enterprise:</span>
                    <span>Unlimited</span>
                  </div>
                </div>
                <Link href="/dashboard/guides/rate-limiting">
                  <Button variant="outline" size="sm">
                    Rate limiting guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
