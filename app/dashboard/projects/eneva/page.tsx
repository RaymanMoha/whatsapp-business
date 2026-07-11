import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, GitBranch, Database, Smartphone, Globe, Server, ExternalLink, Zap, Users, Building, ShieldCheck, Activity, FileText, Phone, Camera, BarChart3, MapPin } from "lucide-react"
import Link from "next/link"

export default function EnevaProjectPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome to ENEVA - Your Onboarding Guide!</h1>
          <p className="text-muted-foreground mt-2">
            Complete energy utility management ecosystem with three main applications and comprehensive backend services
          </p>
        </div>

        <div className="grid gap-6">
          {/* What is ENEVA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-6 text-yellow-500" />
                What is ENEVA?
              </CardTitle>
              <CardDescription>
                ENEVA is an Energy Innovation platform - a complete utility management ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Smartphone className="size-5 text-blue-600" />
                     Customer Mobile App
                  </h4>
                  <p className="text-sm text-muted-foreground">(Eneva-app)</p>
                  <p className="text-sm">For end customers to manage bills and track energy usage</p>
                  <Badge className="bg-blue-100 text-blue-800">Flutter</Badge>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="size-5 text-green-600" />
                     Internal Mobile App
                  </h4>
                  <p className="text-sm text-muted-foreground">(Eneva-core-app)</p>
                  <p className="text-sm">For utility company employees (meter readers, administrators)</p>
                  <Badge className="bg-green-100 text-green-800">Flutter</Badge>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="size-5 text-purple-600" />
                     Internal Web Dashboard
                  </h4>
                  <p className="text-sm text-muted-foreground">(Eneva-core-web)</p>
                  <p className="text-sm">For management, analytics, and system administration</p>
                  <Badge className="bg-purple-100 text-purple-800">React</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="size-6 text-blue-500" />
                 Overall Architecture
              </CardTitle>
              <CardDescription>
                Complete system architecture with all components and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Customer App</h4>
                      <p className="text-sm text-blue-600">(Flutter)</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">Internal App</h4>
                      <p className="text-sm text-green-600">(Flutter)</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Web Dashboard</h4>
                      <p className="text-sm text-purple-600">(React)</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="text-gray-400 text-2xl">↓</div>
                  </div>
                  
                  <div className="bg-orange-100 p-4 rounded-lg max-w-md mx-auto">
                    <h4 className="font-semibold text-orange-800">Backend API</h4>
                    <p className="text-sm text-orange-600">(Node.js/TS)</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="text-gray-400 text-2xl">↓</div>
                  </div>
                  
                  <div className="bg-red-100 p-4 rounded-lg max-w-md mx-auto">
                    <h4 className="font-semibold text-red-800">Firebase</h4>
                    <p className="text-sm text-red-600">Firestore + Auth</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Component Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="size-6 text-green-500" />
                 1. Customer App (Eneva-app)
              </CardTitle>
              <CardDescription>
                Customer-facing mobile application for utility customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-green-600" />
                      Bill Payments: Secure electricity bill payments via mobile
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="size-4 text-blue-600" />
                      Energy Tracking: Real-time electricity consumption monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="size-4 text-purple-600" />
                      Multi-language Support: English and Somali support
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="size-4 text-orange-600" />
                      WhatsApp OTP: Authentication via WhatsApp verification
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-indigo-600" />
                      Usage History: Track consumption patterns over time
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Tech Stack:</h4>
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">Flutter (Dart 3.2.2+)</Badge>
                    <Badge className="bg-orange-100 text-orange-800">Firebase (Auth, Firestore, Storage, Analytics)</Badge>
                    <Badge className="bg-green-100 text-green-800">Riverpod (State Management)</Badge>
                    <Badge className="bg-purple-100 text-purple-800">GoRouter (Navigation)</Badge>
                    <Badge className="bg-gray-100 text-gray-800">Custom UI with animations and SVG graphics</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal App */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-6 text-blue-500" />
                2. Internal App (Eneva-core-app)
              </CardTitle>
              <CardDescription>
                Employee-facing mobile app for utility company staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Activity className="size-4 text-green-600" />
                      Meter Reading: Field workers can read electricity meters with GPS tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="size-4 text-blue-600" />
                      Customer Management: Access customer profiles and meter information
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="size-4 text-purple-600" />
                      Job Management: Assign and track field tasks
                    </li>
                    <li className="flex items-center gap-2">
                      <Camera className="size-4 text-orange-600" />
                      Photo Capture: Document meter readings with images
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="size-4 text-indigo-600" />
                      Offline Capability: Work without internet and sync later
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Tech Stack:</h4>
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">Flutter (Dart 3.2.2+)</Badge>
                    <Badge className="bg-orange-100 text-orange-800">Firebase (same backend as customer app)</Badge>
                    <Badge className="bg-green-100 text-green-800">Provider pattern (State Management)</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Camera Integration</Badge>
                    <Badge className="bg-red-100 text-red-800">Google Maps integration</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Web Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-6 text-purple-500" />
                 3. Web Dashboard (Eneva-core-web)
              </CardTitle>
              <CardDescription>
                Management dashboard for analytics and administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-green-600" />
                      Analytics Dashboard: Energy consumption analytics and reporting
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="size-4 text-blue-600" />
                      Customer Management: Comprehensive customer database
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="size-4 text-yellow-600" />
                      Grid Management: Electrical grid monitoring and management
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="size-4 text-purple-600" />
                      Sales Tracking: Revenue and billing analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="size-4 text-orange-600" />
                      Employee & Inventory Management
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Tech Stack:</h4>
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">React 18 with TypeScript</Badge>
                    <Badge className="bg-green-100 text-green-800">Vite (build tool)</Badge>
                    <Badge className="bg-purple-100 text-purple-800">TailwindCSS + Radix UI</Badge>
                    <Badge className="bg-orange-100 text-orange-800">React Query/TanStack</Badge>
                    <Badge className="bg-red-100 text-red-800">Recharts (data visualization)</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links & Resources</CardTitle>
              <CardDescription>
                Direct access to all ENEVA documentation and development resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* ENEVA Documentation Links */}
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">ENEVA Documentation</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/dashboard/projects/eneva">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 hover:border-blue-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="size-4 text-blue-600" />
                            <h5 className="font-medium">Overview</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">Project overview and getting started guide</p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dashboard/projects/eneva/backend-api">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-orange-200 hover:border-orange-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Server className="size-4 text-orange-600" />
                            <h5 className="font-medium">Backend API</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">Node.js/TypeScript API documentation</p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dashboard/projects/eneva/mobile">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200 hover:border-green-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="size-4 text-green-600" />
                            <h5 className="font-medium">Mobile Apps</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">Flutter customer & internal apps</p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dashboard/projects/eneva/web">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 hover:border-purple-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="size-4 text-purple-600" />
                            <h5 className="font-medium">Web Dashboard</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">React web dashboard documentation</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">System Architecture & Resources</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/projects/eneva/architecture">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-indigo-200 hover:border-indigo-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="size-4 text-indigo-600" />
                            <h5 className="font-medium">Architecture</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">System architecture & deployment</p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="https://bitbucket.org/reon-dev/eneva" target="_blank">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-gray-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="size-4 text-gray-600" />
                            <h5 className="font-medium">Repository</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">Source code repository</p>
                          <div className="flex items-center gap-1 mt-2">
                            <ExternalLink className="size-3 text-blue-600" />
                            <span className="text-xs text-blue-600">Bitbucket</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dashboard/getting-started/quick-start">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200 hover:border-yellow-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="size-4 text-yellow-600" />
                            <h5 className="font-medium">Setup Guide</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">Development environment setup</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>
                Latest changes and improvements to the ENEVA platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">ENV-113: Sync Status Feature</h4>
                  <p className="text-sm text-muted-foreground">Added date/time tracking for activities and improved sync status functionality</p>
                  <p className="text-xs text-gray-500">7 days ago • Eneva-core-web</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Bug Fix: Bill Generation</h4>
                  <p className="text-sm text-muted-foreground">Updated bill generation modal and resolved backend issues</p>
                  <p className="text-xs text-gray-500">2 days ago • Backend</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Employee Management Refactor</h4>
                  <p className="text-sm text-muted-foreground">Connected backend endpoints for employee UI and resolved authentication bugs</p>
                  <p className="text-xs text-gray-500">2 weeks ago • Backend/Web</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
