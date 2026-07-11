import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  Layers, 
  Database, 
  Cloud, 
  Shield, 
  Zap,
  Smartphone,
  Globe,
  Server,
  CheckCircle,
  ExternalLink,
  GitBranch,
  Users,
  Activity,
  Package,
  Code,
  Settings,
  Monitor,
  ArrowRight,
  ArrowDown,
  Network,
  Lock,
  Workflow
} from "lucide-react"
import Link from "next/link"

export default function EnevaArchitecturePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ENEVA System Architecture</h1>
          <p className="text-muted-foreground mt-2">
            Complete architectural overview of the ENEVA energy management platform
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System Design</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="data-flow">Data Flow</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Architecture Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  ENEVA Platform Architecture
                </CardTitle>
                <CardDescription>
                  Comprehensive energy utility management ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                    <div className="text-center space-y-6">
                      {/* Client Layer */}
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Client Applications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-100 p-4 rounded-lg">
                            <Smartphone className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-blue-800">Customer App</h5>
                            <p className="text-sm text-blue-600">Flutter Mobile</p>
                          </div>
                          <div className="bg-green-100 p-4 rounded-lg">
                            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-green-800">Internal App</h5>
                            <p className="text-sm text-green-600">Flutter Mobile</p>
                          </div>
                          <div className="bg-purple-100 p-4 rounded-lg">
                            <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-purple-800">Web Dashboard</h5>
                            <p className="text-sm text-purple-600">React Web App</p>
                          </div>
                        </div>
                      </div>

                      <ArrowDown className="h-6 w-6 text-gray-400 mx-auto" />

                      {/* API Layer */}
                      <div>
                        <h4 className="font-semibold text-lg mb-4">API Gateway & Services</h4>
                        <div className="bg-orange-100 p-4 rounded-lg max-w-md mx-auto">
                          <Server className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <h5 className="font-semibold text-orange-800">Backend API</h5>
                          <p className="text-sm text-orange-600">Node.js + TypeScript + Express</p>
                        </div>
                      </div>

                      <ArrowDown className="h-6 w-6 text-gray-400 mx-auto" />

                      {/* Data Layer */}
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Data & Services Layer</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-red-100 p-4 rounded-lg">
                            <Shield className="h-6 w-6 text-red-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-red-800">Firebase Auth</h5>
                            <p className="text-sm text-red-600">Authentication</p>
                          </div>
                          <div className="bg-yellow-100 p-4 rounded-lg">
                            <Database className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-yellow-800">Firestore</h5>
                            <p className="text-sm text-yellow-600">Operational Data</p>
                          </div>
                          <div className="bg-indigo-100 p-4 rounded-lg">
                            <Activity className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                            <h5 className="font-semibold text-indigo-800">BigQuery</h5>
                            <p className="text-sm text-indigo-600">Analytics Data</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Architecture Principles</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Microservices architecture with clear separation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>API-first design for platform independence</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Cloud-native with Firebase services</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Real-time data synchronization</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Key Characteristics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span>High performance and scalability</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span>Enterprise-grade security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-purple-600" />
                          <span>Cross-platform compatibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-gray-600" />
                          <span>Cloud-first deployment strategy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Design */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  System Design & Components
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of system layers and component interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Presentation Layer */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      Presentation Layer
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Customer Mobile App</h5>
                        <div className="text-sm space-y-1">
                          <div>• Flutter 3.24+ framework</div>
                          <div>• Riverpod state management</div>
                          <div>• Material Design 3</div>
                          <div>• Offline-first architecture</div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Internal Mobile App</h5>
                        <div className="text-sm space-y-1">
                          <div>• Flutter 3.24+ framework</div>
                          <div>• Provider state management</div>
                          <div>• GPS & Camera integration</div>
                          <div>• Offline sync capabilities</div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Web Dashboard</h5>
                        <div className="text-sm space-y-1">
                          <div>• React 18 + TypeScript</div>
                          <div>• Redux Toolkit + React Query</div>
                          <div>• TailwindCSS + Radix UI</div>
                          <div>• Progressive Web App</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Layer */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Server className="h-5 w-5 text-orange-600" />
                      Application Layer
                    </h4>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">RESTful API Backend</h5>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium mb-1">Core Technologies:</div>
                          <div>• Node.js 20+ runtime</div>
                          <div>• Express.js 5.1.0 framework</div>
                          <div>• TypeScript 5.9.2</div>
                          <div>• Firebase Admin SDK</div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Key Features:</div>
                          <div>• JWT authentication</div>
                          <div>• CORS configuration</div>
                          <div>• Request validation</div>
                          <div>• Error handling middleware</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Layer */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Database className="h-5 w-5 text-yellow-600" />
                      Data Layer
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Firebase Authentication</h5>
                        <div className="text-sm space-y-1">
                          <div>• Phone number authentication</div>
                          <div>• WhatsApp OTP integration</div>
                          <div>• Role-based access control</div>
                          <div>• Session management</div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Firestore Database</h5>
                        <div className="text-sm space-y-1">
                          <div>• NoSQL document database</div>
                          <div>• Real-time synchronization</div>
                          <div>• Offline persistence</div>
                          <div>• Security rules enforcement</div>
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">BigQuery Analytics</h5>
                        <div className="text-sm space-y-1">
                          <div>• Data warehouse for analytics</div>
                          <div>• Real-time data streaming</div>
                          <div>• Business intelligence</div>
                          <div>• Performance metrics</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            {/* Component Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Component Architecture
                </CardTitle>
                <CardDescription>
                  Detailed view of system components and their relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Frontend Components */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Frontend Components</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-blue-600" />
                          Mobile Applications
                        </h5>
                        <div className="space-y-3 text-sm">
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="font-medium">Customer App Modules:</div>
                            <div>• Authentication & Onboarding</div>
                            <div>• Dashboard & Analytics</div>
                            <div>• Bill Payment System</div>
                            <div>• Usage Tracking</div>
                            <div>• Customer Support</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <div className="font-medium">Internal App Modules:</div>
                            <div>• Field Operations</div>
                            <div>• Meter Management</div>
                            <div>• Job Tracking</div>
                            <div>• Customer Profiles</div>
                            <div>• Data Synchronization</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-600" />
                          Web Dashboard
                        </h5>
                        <div className="space-y-3 text-sm">
                          <div className="bg-purple-50 p-3 rounded">
                            <div className="font-medium">Core Modules:</div>
                            <div>• Real-time Dashboard</div>
                            <div>• Customer Management</div>
                            <div>• Analytics & Reporting</div>
                            <div>• Grid Management</div>
                            <div>• Payment Processing</div>
                          </div>
                          <div className="bg-indigo-50 p-3 rounded">
                            <div className="font-medium">Admin Modules:</div>
                            <div>• Employee Management</div>
                            <div>• Inventory Tracking</div>
                            <div>• System Configuration</div>
                            <div>• Reports Generation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Backend Components */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Backend Components</h4>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Server className="h-4 w-4 text-orange-600" />
                        API Services Architecture
                      </h5>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="bg-orange-50 p-3 rounded">
                          <div className="font-medium">Core Services:</div>
                          <div>• Authentication Service</div>
                          <div>• Customer Service</div>
                          <div>• Meter Service</div>
                          <div>• Payment Service</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="font-medium">Analytics Services:</div>
                          <div>• Usage Analytics</div>
                          <div>• Dashboard Analytics</div>
                          <div>• Performance Metrics</div>
                          <div>• Business Intelligence</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="font-medium">Utility Services:</div>
                          <div>• File Upload Service</div>
                          <div>• Notification Service</div>
                          <div>• Integration APIs</div>
                          <div>• Health Monitoring</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Components */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Data Components</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Database className="h-4 w-4 text-yellow-600" />
                          Firestore Collections
                        </h5>
                        <div className="text-sm space-y-1">
                          <div>• customers</div>
                          <div>• meters</div>
                          <div>• payments</div>
                          <div>• usages</div>
                          <div>• jobs</div>
                          <div>• employees</div>
                          <div>• inventory</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-indigo-600" />
                          BigQuery Tables
                        </h5>
                        <div className="text-sm space-y-1">
                          <div>• customer_analytics</div>
                          <div>• usage_analytics</div>
                          <div>• payment_analytics</div>
                          <div>• operations_analytics</div>
                          <div>• equipment_analytics</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-gray-600" />
                          External Services
                        </h5>
                        <div className="text-sm space-y-1">
                          <div>• WhatsApp Business API</div>
                          <div>• Mobile Money APIs</div>
                          <div>• Google Maps API</div>
                          <div>• Email Services</div>
                          <div>• SMS Gateway</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-flow" className="space-y-6">
            {/* Data Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Data Flow & Communication
                </CardTitle>
                <CardDescription>
                  How data flows through the ENEVA ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Real-time Data Flow */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">Real-time Data Synchronization</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="bg-blue-100 p-3 rounded-lg mb-2">
                            <Smartphone className="h-6 w-6 text-blue-600 mx-auto" />
                          </div>
                          <div className="text-sm font-medium">Mobile Apps</div>
                        </div>
                        
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        
                        <div className="text-center">
                          <div className="bg-orange-100 p-3 rounded-lg mb-2">
                            <Server className="h-6 w-6 text-orange-600 mx-auto" />
                          </div>
                          <div className="text-sm font-medium">API Gateway</div>
                        </div>
                        
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        
                        <div className="text-center">
                          <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                            <Database className="h-6 w-6 text-yellow-600 mx-auto" />
                          </div>
                          <div className="text-sm font-medium">Firestore</div>
                        </div>
                        
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        
                        <div className="text-center">
                          <div className="bg-purple-100 p-3 rounded-lg mb-2">
                            <Globe className="h-6 w-6 text-purple-600 mx-auto" />
                          </div>
                          <div className="text-sm font-medium">Web Dashboard</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Data Pipeline */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">Analytics Data Pipeline</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="bg-blue-100 p-4 rounded-lg mb-3">
                          <Activity className="h-6 w-6 text-blue-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Data Collection</h5>
                        <p className="text-sm text-muted-foreground">Real-time events from apps</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 p-4 rounded-lg mb-3">
                          <Network className="h-6 w-6 text-green-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Data Processing</h5>
                        <p className="text-sm text-muted-foreground">API transformation layer</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 p-4 rounded-lg mb-3">
                          <Database className="h-6 w-6 text-purple-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Data Storage</h5>
                        <p className="text-sm text-muted-foreground">BigQuery warehouse</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 p-4 rounded-lg mb-3">
                          <Monitor className="h-6 w-6 text-orange-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Data Visualization</h5>
                        <p className="text-sm text-muted-foreground">Dashboard analytics</p>
                      </div>
                    </div>
                  </div>

                  {/* Communication Patterns */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">Synchronous Communication</h5>
                      <div className="space-y-2 text-sm">
                        <div>• REST API calls for immediate responses</div>
                        <div>• Authentication and authorization</div>
                        <div>• Real-time data queries</div>
                        <div>• Payment processing</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">Asynchronous Communication</h5>
                      <div className="space-y-2 text-sm">
                        <div>• Firebase real-time listeners</div>
                        <div>• Background data synchronization</div>
                        <div>• Analytics data streaming</div>
                        <div>• Notification delivery</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  Multi-layered security approach for the ENEVA platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Security Layers */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Security Layers</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lock className="h-5 w-5 text-blue-600" />
                          <h5 className="font-medium">Authentication Layer</h5>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>• Firebase Authentication</div>
                          <div>• Phone number verification</div>
                          <div>• WhatsApp OTP integration</div>
                          <div>• JWT token management</div>
                          <div>• Session security</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <h5 className="font-medium">Authorization Layer</h5>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>• Role-based access control</div>
                          <div>• Permission management</div>
                          <div>• Resource-level security</div>
                          <div>• API endpoint protection</div>
                          <div>• Data access controls</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Network className="h-5 w-5 text-purple-600" />
                          <h5 className="font-medium">Network Layer</h5>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>• HTTPS encryption</div>
                          <div>• CORS configuration</div>
                          <div>• Rate limiting</div>
                          <div>• API gateway security</div>
                          <div>• DDoS protection</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Security */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">Data Security</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium">Data Protection</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Encryption at rest and in transit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Firebase Security Rules</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Data anonymization in BigQuery</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Audit logging and monitoring</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium">Compliance</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>GDPR compliance measures</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Data retention policies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Right to deletion support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Data portability features</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Monitoring */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">Security Monitoring</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="bg-red-100 p-3 rounded-lg mb-2">
                          <Activity className="h-5 w-5 text-red-600 mx-auto" />
                        </div>
                        <div className="font-medium">Threat Detection</div>
                        <div className="text-xs text-muted-foreground">Real-time monitoring</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 p-3 rounded-lg mb-2">
                          <Monitor className="h-5 w-5 text-orange-600 mx-auto" />
                        </div>
                        <div className="font-medium">Access Logging</div>
                        <div className="text-xs text-muted-foreground">Comprehensive audit trails</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                          <Shield className="h-5 w-5 text-yellow-600 mx-auto" />
                        </div>
                        <div className="font-medium">Incident Response</div>
                        <div className="text-xs text-muted-foreground">Automated alerts</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-lg mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                        </div>
                        <div className="font-medium">Compliance Reports</div>
                        <div className="text-xs text-muted-foreground">Regular assessments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            {/* Deployment Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Deployment Architecture
                </CardTitle>
                <CardDescription>
                  Cloud-native deployment strategy and infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Cloud Infrastructure */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">Cloud Infrastructure</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="bg-blue-100 p-4 rounded-lg mb-3">
                            <Cloud className="h-8 w-8 text-blue-600 mx-auto" />
                          </div>
                          <h5 className="font-medium">Google Cloud Platform</h5>
                          <p className="text-sm text-muted-foreground">Primary cloud provider</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-orange-100 p-4 rounded-lg mb-3">
                            <Server className="h-8 w-8 text-orange-600 mx-auto" />
                          </div>
                          <h5 className="font-medium">Firebase Platform</h5>
                          <p className="text-sm text-muted-foreground">Hosting & services</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-green-100 p-4 rounded-lg mb-3">
                            <Globe className="h-8 w-8 text-green-600 mx-auto" />
                          </div>
                          <h5 className="font-medium">Global CDN</h5>
                          <p className="text-sm text-muted-foreground">Content delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Environments */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        Development
                      </h5>
                      <div className="text-sm space-y-1">
                        <div>• Local development servers</div>
                        <div>• Hot reload capabilities</div>
                        <div>• Debug configurations</div>
                        <div>• Test data environments</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-orange-600" />
                        Staging
                      </h5>
                      <div className="text-sm space-y-1">
                        <div>• Pre-production testing</div>
                        <div>• Integration testing</div>
                        <div>• Performance validation</div>
                        <div>• Security testing</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        Production
                      </h5>
                      <div className="text-sm space-y-1">
                        <div>• Live user environments</div>
                        <div>• Auto-scaling enabled</div>
                        <div>• Monitoring & alerts</div>
                        <div>• Backup strategies</div>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Pipeline */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">CI/CD Pipeline</h4>
                    <div className="grid md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="bg-gray-100 p-3 rounded-lg mb-2">
                          <GitBranch className="h-5 w-5 text-gray-600 mx-auto" />
                        </div>
                        <div className="font-medium">Source Control</div>
                        <div className="text-xs text-muted-foreground">Git repository</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-lg mb-2">
                          <Package className="h-5 w-5 text-blue-600 mx-auto" />
                        </div>
                        <div className="font-medium">Build</div>
                        <div className="text-xs text-muted-foreground">Automated builds</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-lg mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                        </div>
                        <div className="font-medium">Test</div>
                        <div className="text-xs text-muted-foreground">Quality assurance</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 p-3 rounded-lg mb-2">
                          <Settings className="h-5 w-5 text-orange-600 mx-auto" />
                        </div>
                        <div className="font-medium">Deploy</div>
                        <div className="text-xs text-muted-foreground">Automated deployment</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-lg mb-2">
                          <Monitor className="h-5 w-5 text-purple-600 mx-auto" />
                        </div>
                        <div className="font-medium">Monitor</div>
                        <div className="text-xs text-muted-foreground">Health monitoring</div>
                      </div>
                    </div>
                  </div>

                  {/* Scalability & Performance */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">Scalability Features</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Auto-scaling Firebase Functions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Global CDN distribution</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Database sharding capabilities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Load balancing</span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">Performance Optimization</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Caching strategies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Code splitting & lazy loading</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Database indexing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Asset optimization</span>
                        </div>
                      </div>
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
            <CardTitle>Quick Links & Resources</CardTitle>
            <CardDescription>
              Access related documentation and development resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/projects/eneva">
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  ENEVA Project Overview
                </Button>
              </Link>
              <Link href="/dashboard/projects/eneva/backend-api">
                <Button variant="outline" size="sm">
                  <Server className="h-4 w-4 mr-2" />
                  Backend API Docs
                </Button>
              </Link>
              <Link href="/dashboard/projects/eneva/mobile">
                <Button variant="outline" size="sm">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile Apps
                </Button>
              </Link>
              <Link href="/dashboard/projects/eneva/web">
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Web Dashboard
                </Button>
              </Link>
              <Link href="https://bitbucket.org/reon-dev/eneva" target="_blank">
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Repository
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
