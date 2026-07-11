import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Copy, ExternalLink, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function QuickStartPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Quick Start Guide</h1>
          <p className="text-muted-foreground mt-2">
            Get up and running with Reon Capital APIs in minutes
          </p>
        </div>

        <div className="grid gap-6">
          {/* Step 1: Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <CardTitle>Get Your API Key</CardTitle>
              </div>
              <CardDescription>
                First, you'll need to obtain an API key from your Reon Capital dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Key Example</span>
                  <Button size="sm" variant="outline">
                    <Copy className="size-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="text-sm text-gray-700">rc_live_1234567890abcdef...</code>
              </div>
              <Link href="/dashboard/getting-started/authentication">
                <Button variant="outline">
                  Learn about Authentication
                  <ExternalLink className="size-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Step 2: Install SDK */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <CardTitle>Install the SDK</CardTitle>
              </div>
              <CardDescription>
                Choose your preferred language and install the Reon Capital SDK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">JavaScript/TypeScript</h4>
                  <code className="text-sm text-gray-700">npm install @reon-capital/sdk</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Python</h4>
                  <code className="text-sm text-gray-700">pip install reon-capital</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Java</h4>
                  <code className="text-sm text-gray-700">gradle: implementation 'com.reon:sdk:1.0.0'</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">C#/.NET</h4>
                  <code className="text-sm text-gray-700">dotnet add package ReonCapital.SDK</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: First API Call */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <CardTitle>Make Your First API Call</CardTitle>
              </div>
              <CardDescription>
                Test your integration with a simple API call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">JavaScript Example</span>
                  <Button size="sm" variant="outline">
                    <Copy className="size-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
{`import { ReonCapital } from '@reon-capital/sdk';

const client = new ReonCapital({
  apiKey: 'your-api-key-here'
});

const response = await client.users.get();
console.log(response);`}
                </pre>
              </div>
              <Link href="/dashboard/getting-started/first-api-call">
                <Button variant="outline">
                  More API Examples
                  <ExternalLink className="size-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Explore more advanced features and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/api-docs">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">API Documentation</h4>
                      <p className="text-sm text-muted-foreground">Explore all available endpoints and their parameters</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/examples">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Code Examples</h4>
                      <p className="text-sm text-muted-foreground">Browse real-world integration examples</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/guides">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Developer Guides</h4>
                      <p className="text-sm text-muted-foreground">In-depth guides for common use cases</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/chat">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Developer Assistant</h4>
                      <p className="text-sm text-muted-foreground">Get help with integration questions</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
