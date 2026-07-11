import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, GitBranch, ExternalLink, Clock, Package } from "lucide-react"
import Link from "next/link"

export default function ZubaProjectPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ZUBA Platform</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive platform solution with full-stack architecture and integrated services
          </p>
        </div>

        <div className="grid gap-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                ZUBA is a robust platform providing comprehensive business solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Repository Size</h4>
                  <p className="text-2xl font-bold text-green-600">116.8 MB</p>
                  <p className="text-sm text-muted-foreground">Last updated 18 hours ago</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Status</h4>
                  <Badge className="bg-green-100 text-green-800">Active Development</Badge>
                  <p className="text-sm text-muted-foreground">Currently being developed</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Priority</h4>
                  <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
                  <p className="text-sm text-muted-foreground">Recent updates and activity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Direct links to ZUBA platform resources and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="https://bitbucket.org/reon-dev/zuba" target="_blank">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <GitBranch className="size-5 text-blue-600" />
                        Bitbucket Repository
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Access the complete ZUBA source code and development history
                      </p>
                      <div className="flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        <span className="text-xs text-blue-600">bitbucket.org/reon-dev/zuba</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/projects/zuba/docs">
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

                <Link href="/dashboard/projects/zuba/setup">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Package className="size-5 text-purple-600" />
                        Setup Guide
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Step-by-step setup and configuration instructions
                      </p>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/chat">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="size-5 text-orange-600" />
                        Developer Support
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get help with ZUBA development questions
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Development Info */}
          <Card>
            <CardHeader>
              <CardTitle>Development Information</CardTitle>
              <CardDescription>
                Current status and development details for ZUBA platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Active Development</h4>
                  <p className="text-sm text-muted-foreground">ZUBA is currently under active development with recent updates</p>
                  <p className="text-xs text-gray-500">Last updated: 18 hours ago</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Large Codebase</h4>
                  <p className="text-sm text-muted-foreground">With 116.8 MB of source code, ZUBA represents a comprehensive platform solution</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Documentation In Progress</h4>
                  <p className="text-sm text-muted-foreground">Detailed documentation and setup guides are being prepared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Get assistance with ZUBA platform development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For ZUBA-specific questions or development assistance, please use our developer assistant or contact the development team.
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
