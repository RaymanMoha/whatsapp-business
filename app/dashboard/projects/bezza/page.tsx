import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, GitBranch, ExternalLink, Zap, Package } from "lucide-react"
import Link from "next/link"

export default function BezzaProjectPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">BEZZA Platform</h1>
          <p className="text-muted-foreground mt-2">
            Lightweight platform solution optimized for performance and scalability
          </p>
        </div>

        <div className="grid gap-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                BEZZA is a streamlined platform focusing on efficiency and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Repository Size</h4>
                  <p className="text-2xl font-bold text-purple-600">2.5 MB</p>
                  <p className="text-sm text-muted-foreground">Last updated yesterday</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Architecture</h4>
                  <Badge className="bg-purple-100 text-purple-800">Lightweight</Badge>
                  <p className="text-sm text-muted-foreground">Optimized for performance</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Status</h4>
                  <Badge className="bg-green-100 text-green-800">Stable</Badge>
                  <p className="text-sm text-muted-foreground">Recently updated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes BEZZA unique among Reon Capital platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="size-5 text-yellow-600" />
                    Performance Optimized
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Lightweight architecture with only 2.5 MB codebase ensures fast execution and minimal resource usage.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="size-5 text-blue-600" />
                    Modular Design
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Streamlined and modular architecture allows for easy maintenance and scalability.
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
                Direct links to BEZZA platform resources and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="https://bitbucket.org/reon-dev/bezza" target="_blank">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <GitBranch className="size-5 text-blue-600" />
                        Bitbucket Repository
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Access the complete BEZZA source code and development history
                      </p>
                      <div className="flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        <span className="text-xs text-blue-600">bitbucket.org/reon-dev/bezza</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/bezza/docs">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Code className="size-5 text-green-600" />
                        Documentation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comprehensive documentation and development guides
                      </p>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/bezza/setup">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Package className="size-5 text-purple-600" />
                        Setup Guide
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Quick setup instructions for the lightweight platform
                      </p>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/chat">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="size-5 text-orange-600" />
                        Developer Support
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get help with BEZZA development questions
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Development Advantages */}
          <Card>
            <CardHeader>
              <CardTitle>Development Advantages</CardTitle>
              <CardDescription>
                Why choose BEZZA for your development needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium">Lightweight Architecture</h4>
                  <p className="text-sm text-muted-foreground">At just 2.5 MB, BEZZA offers minimal footprint with maximum functionality</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Recent Updates</h4>
                  <p className="text-sm text-muted-foreground">Active development with recent updates ensuring modern standards</p>
                  <p className="text-xs text-gray-500">Last updated: yesterday</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Fast Development</h4>
                  <p className="text-sm text-muted-foreground">Streamlined codebase allows for rapid development and deployment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Get assistance with BEZZA platform development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For BEZZA-specific questions or development assistance, please use our developer assistant or contact the development team.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/chat">
                  <Button>Ask Developer Assistant</Button>
                </Link>
                <Link href="/dashboard/resources/contacts">
                  <Button variant="outline">Contact Team</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
