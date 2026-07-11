import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Code, GitBranch, ExternalLink, Building2, Database, Shield, Zap, FileText, BookOpen, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function AnsuDocsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ANSU Enterprise Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive documentation for the ANSU Enterprise Platform
          </p>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="size-5" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  Overview of the ANSU enterprise system architecture and technology stack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Architecture Diagram</h3>
                    <Card className="p-6 bg-slate-50">
                      <div className="text-center space-y-4">
                        <div className="text-sm text-muted-foreground">Mermaid Diagram</div>
                        <pre className="text-xs bg-white p-4 rounded border overflow-x-auto">
{`graph TD
    A[Web Browser] --> B[React Frontend]
    B --> C[Redux Store]
    B --> D[React Query]
    D --> E[REST API Backend]
    E --> F[Firebase Firestore]
    E --> G[Google BigQuery]
    B --> H[Firebase Auth]
    
    subgraph "Frontend Layer"
        B
        C
        D
    end
    
    subgraph "Backend Services"
        E
        F
        G
        H
    end`}
                        </pre>
                      </div>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Code className="size-4" />
                        Frontend Layer
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>React Frontend</strong>: Modern UI with hooks and concurrent features</li>
                        <li>• <strong>Redux Store</strong>: Centralized state management</li>
                        <li>• <strong>React Query</strong>: Server state and data fetching optimization</li>
                        <li>• <strong>Next.js</strong>: Full-stack framework with SSR</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Database className="size-4" />
                        Backend Services
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>REST API</strong>: Scalable API layer</li>
                        <li>• <strong>Firebase Firestore</strong>: NoSQL real-time database</li>
                        <li>• <strong>Google BigQuery</strong>: Data warehouse for analytics</li>
                        <li>• <strong>Firebase Auth</strong>: Secure authentication system</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">Frontend Core</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>React</span>
                        <Badge variant="secondary">18.3.1</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>TypeScript</span>
                        <Badge variant="secondary">5.6.2</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Next.js</span>
                        <Badge variant="secondary">14.x</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>TailwindCSS</span>
                        <Badge variant="secondary">3.4.14</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">State Management</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Redux Toolkit</span>
                        <Badge variant="secondary">2.3.0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>React Query</span>
                        <Badge variant="secondary">5.59.19</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Zustand</span>
                        <Badge variant="secondary">4.x</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-600">Backend</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Firebase</span>
                        <Badge variant="secondary">10.x</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>BigQuery</span>
                        <Badge variant="secondary">Latest</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Node.js API</span>
                        <Badge variant="secondary">18+</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5 text-blue-600" />
                    Energy Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time monitoring dashboard</li>
                    <li>• Customer lifecycle management</li>
                    <li>• Meter management and readings</li>
                    <li>• Grid topology visualization</li>
                    <li>• Outage management system</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5 text-green-600" />
                    Customer Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Customer directory and profiles</li>
                    <li>• Billing and payment processing</li>
                    <li>• Usage analytics and reporting</li>
                    <li>• Account status management</li>
                    <li>• Communication tools</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-5 text-purple-600" />
                    Field Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Job scheduling and assignment</li>
                    <li>• Mobile workforce management</li>
                    <li>• Equipment inventory tracking</li>
                    <li>• Maintenance scheduling</li>
                    <li>• GPS-based location services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="size-5 text-orange-600" />
                    Analytics & Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Business intelligence dashboards</li>
                    <li>• Revenue and financial reports</li>
                    <li>• Performance metrics tracking</li>
                    <li>• Predictive analytics</li>
                    <li>• Export capabilities (PDF, Excel)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  RESTful API endpoints for ANSU platform integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Authentication</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm">
                        POST /api/auth/login<br/>
                        POST /api/auth/logout<br/>
                        GET /api/auth/me
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Customer Management</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm">
                        GET /api/customers<br/>
                        GET /api/customers/:id<br/>
                        POST /api/customers<br/>
                        PUT /api/customers/:id<br/>
                        DELETE /api/customers/:id
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Energy Management</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm">
                        GET /api/meters<br/>
                        GET /api/meters/:id/readings<br/>
                        POST /api/meters/:id/readings<br/>
                        GET /api/grid/topology<br/>
                        GET /api/outages
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Analytics</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm">
                        GET /api/dashboard/analytics<br/>
                        GET /api/reports/usage<br/>
                        GET /api/reports/revenue<br/>
                        POST /api/reports/generate
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Guide</CardTitle>
                <CardDescription>
                  Step-by-step deployment instructions for production environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Prerequisites</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Node.js 18.0.0 or higher</li>
                      <li>• npm 9.0.0 or higher</li>
                      <li>• Firebase CLI</li>
                      <li>• Git 2.40.0 or higher</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Build Process</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm whitespace-pre-line">
{`# 1. Install dependencies
npm ci

# 2. Run type checking
npm run type-check

# 3. Run linting
npm run lint

# 4. Build for production
npm run build

# 5. Output directory: dist/`}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Environment Configuration</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm whitespace-pre-line">
{`# API Configuration
VITE_API_URL=https://api.ansu.com
VITE_API_TIMEOUT=30000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=ansu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ansu-project

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Firebase Hosting</h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm whitespace-pre-line">
{`# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize project
firebase init hosting

# 4. Deploy
firebase deploy --only hosting`}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Quick start guide for ANSU development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Code className="size-4" />
                      Installation
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm whitespace-pre-line">
{`# 1. Clone the repository
git clone https://bitbucket.org/reon-dev/ansu.git
cd ansu

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000`}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="size-4" />
                      Development Scripts
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <code className="text-sm">npm run dev</code>
                        <span className="text-xs text-muted-foreground">Start development server</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <code className="text-sm">npm run build</code>
                        <span className="text-xs text-muted-foreground">Build for production</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <code className="text-sm">npm run lint</code>
                        <span className="text-xs text-muted-foreground">Run ESLint</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <code className="text-sm">npm run test</code>
                        <span className="text-xs text-muted-foreground">Run tests</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="size-4" />
                      Project Structure
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <code className="text-sm whitespace-pre-line">
{`src/
├── app/                 # Page components
│   ├── dashboard/       # Dashboard pages
│   ├── customers/       # Customer management
│   ├── analytics/       # Analytics pages
│   └── ...
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── charts/          # Chart components
│   └── ...
├── lib/                 # Utility libraries
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── assets/              # Static assets`}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Next Steps</h4>
                    <div className="grid gap-3">
                      <Link href="/dashboard/chat">
                        <Button className="w-full justify-start">
                          <Users className="size-4 mr-2" />
                          Get help from Enterprise Assistant
                        </Button>
                      </Link>
                      <Link href="https://bitbucket.org/reon-dev/ansu" target="_blank">
                        <Button variant="outline" className="w-full justify-start">
                          <GitBranch className="size-4 mr-2" />
                          Access the repository
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/dashboard/api-docs">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="size-4" />
                      API Documentation
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Complete API reference and examples
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/examples">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="size-4" />
                      Code Examples
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Sample implementations and tutorials
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/chat">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="size-4" />
                      Developer Support
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Get help from our AI assistant
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
