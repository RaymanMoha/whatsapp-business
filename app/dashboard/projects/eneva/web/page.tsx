import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe, 
  BarChart3, 
  Users, 
  Zap, 
  Building, 
  Shield, 
  Code, 
  Layers,
  ExternalLink,
  CheckCircle,
  Monitor,
  Database,
  Settings,
  FileText,
  GitBranch,
  Package,
  Activity,
  TrendingUp,
  MapPin,
  Wrench,
  DollarSign,
  Search,
  Filter,
  Calendar,
  Download
} from "lucide-react"
import Link from "next/link"

export default function EnevaWebDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ENEVA Web Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            React-based management platform for energy utility operations and analytics
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  ENEVA Web Dashboard Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive React-based management platform for energy utility operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Core Purpose</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Real-time energy consumption monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Complete customer lifecycle management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Advanced reporting and business intelligence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Electrical grid monitoring and maintenance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm">Payment processing and revenue tracking</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Key Capabilities</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Live dashboard with analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Customer database management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Field operations management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Employee and inventory tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Report generation and export</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Version
                </CardTitle>
                <CardDescription>
                  Latest release information and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Version 1.2.11</h4>
                    <Badge className="bg-green-100 text-green-800">Latest</Badge>
                    <p className="text-sm text-muted-foreground">Production ready release</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Last Updated</h4>
                    <p className="text-sm">September 2025</p>
                    <p className="text-sm text-muted-foreground">Enhanced analytics & performance</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Framework</h4>
                    <Badge className="bg-blue-100 text-blue-800">React 18.3.1</Badge>
                    <p className="text-sm text-muted-foreground">TypeScript with Vite</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            {/* System Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  Frontend layer architecture with React and state management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <div className="text-center space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800">Web Browser</h4>
                          <p className="text-sm text-blue-600">User Interface</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800">React Frontend</h4>
                          <p className="text-sm text-green-600">Component Layer</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-800">Redux Store</h4>
                          <p className="text-sm text-purple-600">State Management</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="text-gray-400 text-2xl">↓</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-800">React Query</h4>
                          <p className="text-sm text-orange-600">Data Fetching</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800">REST API</h4>
                          <p className="text-sm text-red-600">Backend Services</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="text-gray-400 text-2xl">↓</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-800">Firebase Auth</h4>
                          <p className="text-sm text-indigo-600">Authentication</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-800">Firestore</h4>
                          <p className="text-sm text-yellow-600">Database</p>
                        </div>
                        <div className="bg-pink-100 p-4 rounded-lg">
                          <h4 className="font-semibold text-pink-800">BigQuery</h4>
                          <p className="text-sm text-pink-600">Analytics</p>
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
                          <span>Component-based design with clear separation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>API-first approach with React Query</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Secure authentication with Firebase</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Performance optimized with code splitting</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Design Features</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-blue-600" />
                          <span>Responsive design with TailwindCSS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span>Role-based access control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-orange-600" />
                          <span>Real-time data synchronization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-emerald-600" />
                          <span>Modular component library</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Core Modules & Features
                </CardTitle>
                <CardDescription>
                  Comprehensive feature set for energy utility management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Dashboard Analytics</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Real-time energy consumption metrics</div>
                      <div>• KPI cards with key performance indicators</div>
                      <div>• Interactive charts and data visualization</div>
                      <div>• Custom date range filtering</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Customer Management</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Searchable customer database</div>
                      <div>• Detailed customer profiles</div>
                      <div>• Meter assignments and readings</div>
                      <div>• Billing history and account status</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Analytics Module</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• App usage statistics</div>
                      <div>• Performance metrics monitoring</div>
                      <div>• User behavior analysis</div>
                      <div>• Data export capabilities</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold">Jobs Management</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Job scheduling and assignment</div>
                      <div>• Real-time progress tracking</div>
                      <div>• GPS-based location tracking</div>
                      <div>• Completion reports and documentation</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <h4 className="font-semibold">Payment Management</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• E-money tracking and management</div>
                      <div>• Payment assignment to customers</div>
                      <div>• Complete transaction history</div>
                      <div>• Revenue analytics and reporting</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold">Grid Management</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Visual network representation</div>
                      <div>• Equipment monitoring and status</div>
                      <div>• Outage management and response</div>
                      <div>• Load analysis and optimization</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-semibold">Inventory Management</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Equipment and parts tracking</div>
                      <div>• Real-time stock level monitoring</div>
                      <div>• Automated reorder alerts</div>
                      <div>• Asset lifecycle management</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-pink-600" />
                      <h4 className="font-semibold">Reports Module</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Usage and consumption reports</div>
                      <div>• Financial transaction summaries</div>
                      <div>• Custom report generation</div>
                      <div>• PDF, Excel, CSV export options</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h4 className="font-semibold">Administration</h4>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Employee management and permissions</div>
                      <div>• District and geographic administration</div>
                      <div>• Role-based access control</div>
                      <div>• System configuration and audit logs</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UI Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  User Interface Features
                </CardTitle>
                <CardDescription>
                  Modern, responsive interface with advanced functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Data Management</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-600" />
                        <span>Advanced search and filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-green-600" />
                        <span>Sortable data tables with pagination</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>Date range pickers and filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-orange-600" />
                        <span>Export data in multiple formats</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Visualization</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span>Interactive charts with Recharts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span>Google Maps integration for locations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span>Real-time data updates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-orange-600" />
                        <span>Responsive design for all devices</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech-stack" className="space-y-6">
            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technology Stack
                </CardTitle>
                <CardDescription>
                  Modern frontend technologies and development tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Frontend Core</h4>
                    <div className="space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">React 18.3.1</Badge>
                      <Badge className="bg-purple-100 text-purple-800">TypeScript 5.6.2</Badge>
                      <Badge className="bg-green-100 text-green-800">Vite 5.4.10</Badge>
                      <Badge className="bg-cyan-100 text-cyan-800">TailwindCSS 3.4.14</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">State Management</h4>
                    <div className="space-y-2">
                      <Badge className="bg-red-100 text-red-800">Redux Toolkit 2.3.0</Badge>
                      <Badge className="bg-orange-100 text-orange-800">React Query 5.59.19</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">React Router 6.27.0</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">UI & Design</h4>
                    <div className="space-y-2">
                      <Badge className="bg-indigo-100 text-indigo-800">Radix UI</Badge>
                      <Badge className="bg-pink-100 text-pink-800">Recharts</Badge>
                      <Badge className="bg-gray-100 text-gray-800">Lucide Icons</Badge>
                      <Badge className="bg-teal-100 text-teal-800">React PDF</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Backend Integration</h4>
                    <div className="space-y-2">
                      <Badge className="bg-orange-100 text-orange-800">Firebase Auth</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">Firestore</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Google BigQuery</Badge>
                      <Badge className="bg-green-100 text-green-800">REST API</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Development Tools</h4>
                    <div className="space-y-2">
                      <Badge className="bg-gray-100 text-gray-800">ESLint</Badge>
                      <Badge className="bg-purple-100 text-purple-800">Prettier</Badge>
                      <Badge className="bg-blue-100 text-blue-800">TypeScript Strict</Badge>
                      <Badge className="bg-green-100 text-green-800">Vite HMR</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">External Services</h4>
                    <div className="space-y-2">
                      <Badge className="bg-red-100 text-red-800">Google Maps</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">Google Analytics</Badge>
                      <Badge className="bg-orange-100 text-orange-800">Firebase Hosting</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Structure
                </CardTitle>
                <CardDescription>
                  Organized codebase with clear separation of concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>📁 Eneva-core-web/</div>
                    <div className="ml-4">├── 📄 package.json</div>
                    <div className="ml-4">├── 📄 vite.config.ts</div>
                    <div className="ml-4">├── 📄 tailwind.config.js</div>
                    <div className="ml-4">├── 📁 public/ <span className="text-gray-500"># Static assets</span></div>
                    <div className="ml-4">└── 📁 src/</div>
                    <div className="ml-8">├── 📄 main.tsx <span className="text-gray-500"># Entry point</span></div>
                    <div className="ml-8">├── 📁 app/ <span className="text-gray-500"># Page components</span></div>
                    <div className="ml-12">├── 📁 dashboard/</div>
                    <div className="ml-12">├── 📁 customers/</div>
                    <div className="ml-12">├── 📁 analytics/</div>
                    <div className="ml-12">└── 📁 jobs/</div>
                    <div className="ml-8">├── 📁 components/ <span className="text-gray-500"># UI components</span></div>
                    <div className="ml-8">├── 📁 lib/ <span className="text-gray-500"># Utilities</span></div>
                    <div className="ml-8">├── 📁 hooks/ <span className="text-gray-500"># Custom hooks</span></div>
                    <div className="ml-8">├── 📁 queries/ <span className="text-gray-500"># React Query</span></div>
                    <div className="ml-8">└── 📁 types/ <span className="text-gray-500"># TypeScript types</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Step-by-step setup guide for development environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Prerequisites</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm font-mono">
                        <div>Node.js &gt;= 18.0.0</div>
                        <div>npm &gt;= 9.0.0</div>
                        <div>Git &gt;= 2.40.0</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Installation Steps</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm font-mono">
                        <div># 1. Clone the repository</div>
                        <div>git clone https://bitbucket.org/reon-dev/eneva.git</div>
                        <div>cd eneva/Eneva-core-web</div>
                        <div className="my-2"></div>
                        <div># 2. Install dependencies</div>
                        <div>npm install</div>
                        <div className="my-2"></div>
                        <div># 3. Set up environment variables</div>
                        <div>cp .env.example .env.local</div>
                        <div className="my-2"></div>
                        <div># 4. Start development server</div>
                        <div>npm run dev</div>
                        <div className="my-2"></div>
                        <div># 5. Open browser at http://localhost:5173</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Environment Configuration</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm font-mono">
                        <div># API Configuration</div>
                        <div>VITE_API_URL=http://localhost:5000/api</div>
                        <div className="my-2"></div>
                        <div># Firebase Configuration</div>
                        <div>VITE_FIREBASE_API_KEY=your_firebase_api_key</div>
                        <div>VITE_FIREBASE_PROJECT_ID=your_project_id</div>
                        <div className="my-2"></div>
                        <div># Google Maps</div>
                        <div>VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            {/* Development Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Development Guide
                </CardTitle>
                <CardDescription>
                  Development workflow and coding standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Available Scripts</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm font-mono">
                          <div>npm run dev <span className="text-gray-500"># Development server</span></div>
                          <div>npm run build <span className="text-gray-500"># Production build</span></div>
                          <div>npm run preview <span className="text-gray-500"># Preview build</span></div>
                          <div>npm run lint <span className="text-gray-500"># Run ESLint</span></div>
                          <div>npm run lint:fix <span className="text-gray-500"># Fix ESLint issues</span></div>
                          <div>npm run type-check <span className="text-gray-500"># TypeScript check</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Code Standards</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Use TypeScript for all new code</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Follow ESLint and Prettier configurations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Write meaningful commit messages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Add JSDoc comments for complex functions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Adding New Features</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div><strong>1. Create Feature Structure:</strong></div>
                        <div className="font-mono ml-4">src/app/new-feature/</div>
                        <div className="font-mono ml-4">├── page.tsx</div>
                        <div className="font-mono ml-4">├── components/</div>
                        <div className="font-mono ml-4">└── hooks/</div>
                        <div className="my-2"></div>
                        <div><strong>2. Add Navigation Route</strong></div>
                        <div><strong>3. Update Sidebar Menu</strong></div>
                        <div><strong>4. Implement Components</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debugging Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Debugging & Tools
                </CardTitle>
                <CardDescription>
                  Development tools and debugging capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Development Tools</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Redux DevTools for state inspection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span>React Query DevTools for data fetching</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-purple-600" />
                        <span>React Developer Tools browser extension</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-orange-600" />
                        <span>Vite HMR for instant updates</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Performance Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span>Bundle analyzer for size optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Lighthouse performance audits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span>React Profiler for component analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-600" />
                        <span>Code splitting and lazy loading</span>
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
                  <Globe className="h-5 w-5" />
                  Deployment & Production
                </CardTitle>
                <CardDescription>
                  Build and deployment processes for production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Build Process</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm font-mono">
                          <div># 1. Install dependencies</div>
                          <div>npm ci</div>
                          <div className="my-2"></div>
                          <div># 2. Run type checking</div>
                          <div>npm run type-check</div>
                          <div className="my-2"></div>
                          <div># 3. Run linting</div>
                          <div>npm run lint</div>
                          <div className="my-2"></div>
                          <div># 4. Build for production</div>
                          <div>npm run build</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Firebase Hosting</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm font-mono">
                          <div># 1. Install Firebase CLI</div>
                          <div>npm install -g firebase-tools</div>
                          <div className="my-2"></div>
                          <div># 2. Login to Firebase</div>
                          <div>firebase login</div>
                          <div className="my-2"></div>
                          <div># 3. Deploy</div>
                          <div>firebase deploy --only hosting</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Production Optimizations</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Code splitting for optimal loading</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Tree shaking to remove unused code</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Minification and compression</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Asset optimization and caching</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Environment-specific builds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Source map generation for debugging</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Progressive Web App features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Performance monitoring integration</span>
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
                  <Database className="h-4 w-4 mr-2" />
                  Backend API Docs
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
