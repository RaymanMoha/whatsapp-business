import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, GitBranch, ExternalLink, Building2, Briefcase, Shield } from "lucide-react"
import Link from "next/link"

export default function AnsuProjectPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ANSU Enterprise Platform</h1>
          <p className="text-muted-foreground mt-2">
            Large-scale enterprise solution with comprehensive business capabilities
          </p>
        </div>

        <div className="grid gap-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                ANSU represents the flagship enterprise platform in the Reon Capital ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Repository Size</h4>
                  <p className="text-2xl font-bold text-indigo-600">1,006.7 MB</p>
                  <p className="text-sm text-muted-foreground">Last updated Aug 18, 2025</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Architecture</h4>
                  <Badge className="bg-indigo-100 text-indigo-800">Enterprise</Badge>
                  <p className="text-sm text-muted-foreground">Largest codebase</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Status</h4>
                  <Badge className="bg-blue-100 text-blue-800">Production Ready</Badge>
                  <p className="text-sm text-muted-foreground">Enterprise-grade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Features */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Features</CardTitle>
              <CardDescription>
                Comprehensive business capabilities for large-scale operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600" />
                    Enterprise Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Robust enterprise-grade architecture with over 1GB of comprehensive business logic and integrations.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="size-5 text-green-600" />
                    Security & Compliance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-level security features with comprehensive compliance frameworks built-in.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="size-5 text-purple-600" />
                    Scalable Infrastructure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Designed to handle large-scale enterprise workloads with advanced scalability features.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="size-5 text-orange-600" />
                    Comprehensive APIs
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Extensive API ecosystem supporting complex enterprise integrations and workflows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Direct links to ANSU platform resources and enterprise documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="https://bitbucket.org/reon-dev/ansu" target="_blank">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <GitBranch className="size-5 text-blue-600" />
                        Bitbucket Repository
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Access the complete ANSU enterprise source code (1GB+)
                      </p>
                      <div className="flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        <span className="text-xs text-blue-600">bitbucket.org/reon-dev/ansu</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/ansu/docs">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Code className="size-5 text-green-600" />
                        Enterprise Documentation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comprehensive enterprise documentation and architecture guides
                      </p>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/ansu/api">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Building2 className="size-5 text-purple-600" />
                        API Reference
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete API documentation for enterprise integrations
                      </p>
                      <Badge className="bg-purple-100 text-purple-800">Available</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/ansu/backend-api">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="size-5 text-red-600" />
                        ENEVA Backend API
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete ENEVA Backend API documentation with endpoints
                      </p>
                      <Badge className="bg-red-100 text-red-800">New</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/chat">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="size-5 text-orange-600" />
                        Enterprise Support
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get enterprise-level support for ANSU development
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Scale */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Scale</CardTitle>
              <CardDescription>
                Understanding the scope and capabilities of ANSU
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-medium">Massive Codebase</h4>
                  <p className="text-sm text-muted-foreground">Over 1GB of enterprise code representing the largest platform in Reon Capital's portfolio</p>
                  <p className="text-xs text-gray-500">Repository size: 1,006.7 MB</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Production Ready</h4>
                  <p className="text-sm text-muted-foreground">Mature enterprise platform with comprehensive business logic and integrations</p>
                  <p className="text-xs text-gray-500">Last updated: August 18, 2025</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Enterprise Features</h4>
                  <p className="text-sm text-muted-foreground">Advanced security, compliance, scalability, and integration capabilities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Architecture Highlights</CardTitle>
              <CardDescription>
                Key architectural components and design patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Microservices Architecture</h4>
                  <p className="text-sm text-muted-foreground">
                    Distributed architecture supporting independent service deployment and scaling
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Enterprise Integrations</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive integration capabilities with enterprise systems and third-party services
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-layered security approach with enterprise-grade authentication and authorization
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">High Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    Designed for 99.9% uptime with redundancy and failover capabilities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Support</CardTitle>
              <CardDescription>
                Get enterprise-level assistance with ANSU platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For ANSU enterprise platform questions, integration support, or architectural guidance, our enterprise support team is available to assist.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/chat">
                  <Button>Enterprise Assistant</Button>
                </Link>
                <Link href="/dashboard/resources/enterprise-support">
                  <Button variant="outline">Enterprise Support</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
