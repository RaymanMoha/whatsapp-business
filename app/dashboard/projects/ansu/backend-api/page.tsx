import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code, 
  Server, 
  Database, 
  Shield, 
  Zap, 
  FileText, 
  GitBranch,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Monitor,
  Settings
} from "lucide-react"
import Link from "next/link"

export default function EnevaBackendApiPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ENEVA Backend API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Complete Node.js/TypeScript RESTful API for energy management ecosystem
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technology Stack
                </CardTitle>
                <CardDescription>
                  Modern Node.js backend with TypeScript and Firebase integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">Runtime</h4>
                    <Badge className="bg-green-100 text-green-800">Node.js 20</Badge>
                    <p className="text-sm text-muted-foreground">Latest LTS version</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">Framework</h4>
                    <Badge className="bg-blue-100 text-blue-800">Express.js 5.1.0</Badge>
                    <p className="text-sm text-muted-foreground">Fast web framework</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">Language</h4>
                    <Badge className="bg-purple-100 text-purple-800">TypeScript 5.9.2</Badge>
                    <p className="text-sm text-muted-foreground">Type safety</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">Database</h4>
                    <Badge className="bg-orange-100 text-orange-800">Firebase</Badge>
                    <p className="text-sm text-muted-foreground">Firestore + BigQuery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Core Features
                </CardTitle>
                <CardDescription>
                  Comprehensive energy management API capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Customer Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Complete CRUD operations for customer profiles, accounts, and business information</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Meter Operations</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Meter creation, readings, updates, and real-time data synchronization</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Payment Processing</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Comprehensive payment handling with mobile money and banking integrations</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Analytics & Reporting</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">BigQuery integration for advanced analytics and business intelligence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architecture Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Architecture Overview
                </CardTitle>
                <CardDescription>
                  Scalable and secure API architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">RESTful Design</h4>
                    <p className="text-sm text-muted-foreground">Clean, predictable API endpoints following REST principles</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Middleware Pattern</h4>
                    <p className="text-sm text-muted-foreground">Modular request processing with validation and authentication</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">Data Separation</h4>
                    <p className="text-sm text-muted-foreground">Clear separation between operational data (Firestore) and analytics (BigQuery)</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Security First</h4>
                    <p className="text-sm text-muted-foreground">Multi-layer security with authentication, validation, and error handling</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            {/* API Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Endpoints Overview
                </CardTitle>
                <CardDescription>
                  Complete list of available API endpoints by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Customer Management</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/customers</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/customers/create-customer</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">PUT</Badge>
                        <code>/customers/update-customer</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/customers/get-customer/:id/:meterId</code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Payment Processing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/payments</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/payments/add-payment</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">PUT</Badge>
                        <code>/payments/assign-payments</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/payments/create-reversal-request</code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Meter Operations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/meters/get-latest-meterId</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/meters/create-meter</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">PUT</Badge>
                        <code>/meters/update-meter</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/meters/record-reading</code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Analytics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/dashboard/get-dashboard-analytics</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/activity/app-usage</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/usages/analytics</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/activity/performance-metrics</code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Base URLs */}
            <Card>
              <CardHeader>
                <CardTitle>Base URLs</CardTitle>
                <CardDescription>API endpoint base URLs for different environments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800">Development</Badge>
                    <code className="text-sm">http://localhost:5000/api</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800">Production</Badge>
                    <code className="text-sm">https://your-production-domain.com/api</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication & Security
                </CardTitle>
                <CardDescription>
                  Firebase Authentication with role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Authentication Flow</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>User login with phone/password</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Firebase Authentication verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>JWT token generation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Authorization header validation</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Security Features</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Firebase Authentication</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>CORS Configuration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Role-Based Access Control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Request Validation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Authentication Endpoints</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/auth/login</code> - User login with phone/password
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/auth/verify-otp</code> - Verify WhatsApp OTP
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/auth/refresh-token</code> - Refresh authentication token
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code>/auth/logout</code> - User logout
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            {/* Database Design */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Architecture
                </CardTitle>
                <CardDescription>
                  Firebase Firestore and BigQuery integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Firebase Firestore</h4>
                      <p className="text-sm text-muted-foreground">Primary NoSQL database for operational data</p>
                      <div className="space-y-2 text-sm">
                        <div>• customers - Customer profiles and account data</div>
                        <div>• meters - Meter information and readings</div>
                        <div>• payments - Payment transactions</div>
                        <div>• usages - Historical usage data</div>
                        <div>• jobs - Work orders and field tasks</div>
                        <div>• employees - Staff management</div>
                        <div>• inventory - Equipment and parts</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Google BigQuery</h4>
                      <p className="text-sm text-muted-foreground">Data warehouse for analytics and reporting</p>
                      <div className="space-y-2 text-sm">
                        <div>• Customer analytics - Real-time stream</div>
                        <div>• Usage analytics - Consumption data</div>
                        <div>• Payment analytics - Revenue tracking</div>
                        <div>• Operations analytics - Job performance</div>
                        <div>• Equipment analytics - Meter data</div>
                        <div>• Billing analytics - Daily batch processing</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Data Models</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium">Customer Model</h5>
                        <code className="text-xs">customerId, firstName, lastName, businessName, customerType, phoneNumbers, address, meterId, status</code>
                      </div>
                      <div>
                        <h5 className="font-medium">Payment Model</h5>
                        <code className="text-xs">paymentId, customerId, meterId, amount, paymentType, transactionRef, status</code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            {/* Deployment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Deployment & Setup
                </CardTitle>
                <CardDescription>
                  Firebase Functions deployment and environment configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Prerequisites</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Node.js &gt;= 20.0.0</div>
                        <div>• npm &gt;= 9.0.0</div>
                        <div>• TypeScript &gt;= 5.0.0</div>
                        <div>• Firebase CLI &gt;= 12.0.0</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Environment Variables</h4>
                      <div className="space-y-2 text-sm">
                        <div>• NODE_ENV=development</div>
                        <div>• DEV_CREDENTIALS (Firebase)</div>
                        <div>• BIGQUERY_PROJECT_ID</div>
                        <div>• WHATSAPP_API_KEY</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Deployment Commands</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div>npm run build</div>
                      <div>firebase deploy --only functions</div>
                      <div>firebase functions:log</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Available Scripts</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Development</div>
                        <div>• npm run dev - Start dev server</div>
                        <div>• npm run build - Compile TypeScript</div>
                        <div>• npm run start - Start production</div>
                      </div>
                      <div>
                        <div className="font-medium">Testing</div>
                        <div>• npm test - Run unit tests</div>
                        <div>• npm run test:watch - Watch mode</div>
                        <div>• npm run test:coverage - Coverage report</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Monitoring & Logging
                </CardTitle>
                <CardDescription>
                  Performance monitoring and error tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Firebase Functions Monitoring</h4>
                      <div className="space-y-2 text-sm">
                        <div>• firebase functions:log</div>
                        <div>• firebase functions:log --only functionName</div>
                        <div>• firebase functions:log --follow</div>
                        <div>• Real-time log streaming</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Performance Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Request duration monitoring</div>
                        <div>• Status code tracking</div>
                        <div>• User agent logging</div>
                        <div>• IP address tracking</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Error Monitoring</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Stack trace logging</div>
                        <div>• Error context capture</div>
                        <div>• User session tracking</div>
                        <div>• Request body logging</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">BigQuery Analytics</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Job status monitoring</div>
                        <div>• Bytes processed tracking</div>
                        <div>• Query duration analysis</div>
                        <div>• Performance metrics</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Health Check Endpoint</h4>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code>/health</code>
                      </div>
                      <p className="text-muted-foreground">Returns system status, uptime, version, and environment information</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Access related documentation and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/projects/ansu/docs">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Full Documentation
                </Button>
              </Link>
              <Link href="/dashboard/projects/ansu">
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-2" />
                  ANSU Project
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
