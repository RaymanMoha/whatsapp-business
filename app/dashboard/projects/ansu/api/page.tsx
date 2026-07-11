import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Code, Database, Shield, Zap, Globe, Key, FileJson, Activity } from "lucide-react"
import Link from "next/link"

export default function AnsuApiPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ANSU API Reference</h1>
          <p className="text-muted-foreground mt-2">
            Complete API documentation for ANSU Enterprise Platform integration
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="size-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">REST API</h3>
              <p className="text-xs text-muted-foreground">RESTful endpoints</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="size-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-xs text-muted-foreground">JWT & OAuth 2.0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="size-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Real-time</h3>
              <p className="text-xs text-muted-foreground">WebSocket support</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileJson className="size-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold">JSON Format</h3>
              <p className="text-xs text-muted-foreground">Structured data</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="authentication" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="size-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Secure authentication using JWT tokens and OAuth 2.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Login</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/auth/login</code>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Request Body:</strong>
                          <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "email": "user@example.com",
  "password": "securePassword123",
  "remember_me": true
}`}
                          </pre>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpc0lzQVJlZnJlc2hUb2tlbg...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"]
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Token Refresh</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/auth/refresh</code>
                      </div>
                      <div className="text-sm">
                        <strong>Headers:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
Authorization: Bearer &lt;refresh_token&gt;
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Logout</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/auth/logout</code>
                      </div>
                      <div className="text-sm">
                        <strong>Headers:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
Authorization: Bearer &lt;access_token&gt;
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Customer Management
                </CardTitle>
                <CardDescription>
                  Manage customer accounts, profiles, and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Get All Customers</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="ml-2 text-sm">/api/customers</code>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Query Parameters:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• <code>page</code> - Page number (default: 1)</li>
                            <li>• <code>limit</code> - Items per page (default: 20, max: 100)</li>
                            <li>• <code>search</code> - Search customers by name, email, or ID</li>
                            <li>• <code>status</code> - Filter by status (active, inactive, suspended)</li>
                            <li>• <code>sort</code> - Sort field (name, email, created_at)</li>
                            <li>• <code>order</code> - Sort order (asc, desc)</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "data": [
    {
      "id": "cust_123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "ST",
        "zip_code": "12345",
        "country": "US"
      },
      "status": "active",
      "account_number": "ACC001234",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-09-10T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "pages": 63
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Create Customer</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/customers</code>
                      </div>
                      <div className="text-sm">
                        <strong>Request Body:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701",
    "country": "US"
  },
  "meter_number": "MTR789012",
  "service_type": "residential"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Get Customer Details</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="ml-2 text-sm">/api/customers/:id</code>
                      </div>
                      <div className="text-sm">
                        <strong>Response includes:</strong>
                        <ul className="text-xs mt-1 space-y-1">
                          <li>• Customer profile information</li>
                          <li>• Associated meters and readings</li>
                          <li>• Billing history and payment records</li>
                          <li>• Usage analytics and consumption patterns</li>
                          <li>• Account status and service details</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5" />
                  Energy Management
                </CardTitle>
                <CardDescription>
                  Meter readings, grid management, and energy distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Get Meter Readings</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="ml-2 text-sm">/api/meters/:meter_id/readings</code>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Query Parameters:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• <code>from_date</code> - Start date (ISO 8601)</li>
                            <li>• <code>to_date</code> - End date (ISO 8601)</li>
                            <li>• <code>interval</code> - Reading interval (hourly, daily, monthly)</li>
                            <li>• <code>type</code> - Reading type (consumption, demand, voltage)</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "meter_id": "MTR789012",
  "customer_id": "cust_123",
  "readings": [
    {
      "timestamp": "2024-09-10T00:00:00Z",
      "consumption_kwh": 25.4,
      "demand_kw": 5.2,
      "voltage": 240.1,
      "power_factor": 0.95,
      "frequency": 59.98
    }
  ],
  "summary": {
    "total_consumption": 762.5,
    "average_demand": 4.8,
    "peak_demand": 8.7,
    "reading_count": 30
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Submit Meter Reading</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/meters/:meter_id/readings</code>
                      </div>
                      <div className="text-sm">
                        <strong>Request Body:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "reading_type": "manual",
  "timestamp": "2024-09-10T14:30:00Z",
  "consumption_kwh": 1547.8,
  "demand_kw": 6.2,
  "voltage": 239.7,
  "read_by": "field_tech_001",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "notes": "Regular monthly reading"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Grid Topology</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="ml-2 text-sm">/api/grid/topology</code>
                      </div>
                      <div className="text-sm">
                        <strong>Response includes:</strong>
                        <ul className="text-xs mt-1 space-y-1">
                          <li>• Transformer locations and capacity</li>
                          <li>• Distribution lines and connections</li>
                          <li>• Meter assignments to transformers</li>
                          <li>• Load distribution and capacity utilization</li>
                          <li>• Outage status and maintenance schedules</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  Analytics & Reporting
                </CardTitle>
                <CardDescription>
                  Business intelligence, usage analytics, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Dashboard Analytics</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="ml-2 text-sm">/api/dashboard/analytics</code>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Query Parameters:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• <code>from_date</code> - Start date for analytics period</li>
                            <li>• <code>to_date</code> - End date for analytics period</li>
                            <li>• <code>granularity</code> - Data granularity (hour, day, week, month)</li>
                            <li>• <code>metrics</code> - Comma-separated metrics to include</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "period": {
    "from": "2024-08-01T00:00:00Z",
    "to": "2024-09-01T00:00:00Z"
  },
  "kpis": {
    "total_customers": 12500,
    "active_customers": 11875,
    "total_consumption_kwh": 2847562.5,
    "total_revenue": 284756.25,
    "average_bill": 95.25,
    "collection_rate": 0.98
  },
  "trends": {
    "consumption": [
      {"date": "2024-08-01", "value": 92500.4},
      {"date": "2024-08-02", "value": 94200.1}
    ],
    "revenue": [
      {"date": "2024-08-01", "value": 9250.04},
      {"date": "2024-08-02", "value": 9420.01}
    ]
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Generate Report</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/reports/generate</code>
                      </div>
                      <div className="text-sm">
                        <strong>Request Body:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "report_type": "usage_summary",
  "format": "pdf",
  "period": {
    "from": "2024-08-01",
    "to": "2024-08-31"
  },
  "filters": {
    "customer_type": "residential",
    "region": "north",
    "min_usage": 100
  },
  "include_charts": true,
  "delivery_method": "email"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>
                  Real-time event notifications and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Available Events</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Customer Events</h5>
                        <ul className="text-xs space-y-1">
                          <li>• customer.created</li>
                          <li>• customer.updated</li>
                          <li>• customer.status_changed</li>
                          <li>• customer.payment_received</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Energy Events</h5>
                        <ul className="text-xs space-y-1">
                          <li>• meter.reading_received</li>
                          <li>• meter.threshold_exceeded</li>
                          <li>• grid.outage_detected</li>
                          <li>• grid.maintenance_scheduled</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Create Webhook</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="ml-2 text-sm">/api/webhooks</code>
                      </div>
                      <div className="text-sm">
                        <strong>Request Body:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "url": "https://your-app.com/webhooks/ansu",
  "events": [
    "customer.created",
    "meter.reading_received",
    "grid.outage_detected"
  ],
  "active": true,
  "secret": "your-webhook-secret"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Webhook Payload Example</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="text-sm">
                        <strong>Event: meter.reading_received</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">
{`{
  "event": "meter.reading_received",
  "timestamp": "2024-09-10T14:30:00Z",
  "id": "evt_abc123",
  "data": {
    "meter_id": "MTR789012",
    "customer_id": "cust_123",
    "reading": {
      "consumption_kwh": 25.4,
      "demand_kw": 5.2,
      "timestamp": "2024-09-10T14:30:00Z"
    }
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>SDK & Libraries</CardTitle>
            <CardDescription>
              Official SDKs and client libraries for popular programming languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">JavaScript/Node.js</h4>
                <div className="bg-slate-50 p-2 rounded text-xs">
                  <code>npm install @ansu/api-client</code>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Python</h4>
                <div className="bg-slate-50 p-2 rounded text-xs">
                  <code>pip install ansu-api</code>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">PHP</h4>
                <div className="bg-slate-50 p-2 rounded text-xs">
                  <code>composer require ansu/api-client</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits & Error Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Rate Limits</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Standard:</strong> 1000 requests/hour</li>
                  <li>• <strong>Premium:</strong> 5000 requests/hour</li>
                  <li>• <strong>Enterprise:</strong> Unlimited</li>
                  <li>• <strong>Burst:</strong> 100 requests/minute</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Error Codes</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>400:</strong> Bad Request</li>
                  <li>• <strong>401:</strong> Unauthorized</li>
                  <li>• <strong>403:</strong> Forbidden</li>
                  <li>• <strong>404:</strong> Not Found</li>
                  <li>• <strong>429:</strong> Rate Limited</li>
                  <li>• <strong>500:</strong> Internal Error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
