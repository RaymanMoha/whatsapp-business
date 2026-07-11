import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Download, ExternalLink, Package } from "lucide-react"
import Link from "next/link"

export default function CodeExamplesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Code Examples & Integration</h1>
          <p className="text-muted-foreground mt-2">
            Integration patterns and examples for Reon Capital platforms
          </p>
        </div>

        <div className="grid gap-6">
          {/* Project Access */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/projects/eneva">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">ENEVA</CardTitle>
                    <Badge className="bg-green-100 text-green-800">98.1 MB</Badge>
                  </div>
                  <CardDescription>
                    Energy platform architecture patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">bitbucket.org/reon-dev/eneva</code>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-full">
                      <Package className="size-4 mr-1" />
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/projects/zuba">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">ZUBA</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">116.8 MB</Badge>
                  </div>
                  <CardDescription>
                    Advanced platform solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">bitbucket.org/reon-dev/zuba</code>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-full">
                      <Package className="size-4 mr-1" />
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/projects/bezza">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">BEZZA</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800">2.5 MB</Badge>
                  </div>
                  <CardDescription>
                    Lightweight platform patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">bitbucket.org/reon-dev/bezza</code>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-full">
                      <Package className="size-4 mr-1" />
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/projects/ansu">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">ANSU</CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-800">1,006.7 MB</Badge>
                  </div>
                  <CardDescription>
                    Enterprise platform architecture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">bitbucket.org/reon-dev/ansu</code>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-full">
                      <Package className="size-4 mr-1" />
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Integration Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Integration Examples</CardTitle>
              <CardDescription>
                Common integration patterns across Reon Capital platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="size-5" />
                    ENEVA Energy Data
                  </h3>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`// ENEVA Platform Integration
const enevaConfig = {
  apiEndpoint: 'https://api.eneva.reon.capital',
  version: 'v2.1'
};

// Fetch energy consumption data
async function getEnergyData() {
  const response = await fetch(
    \`\${enevaConfig.apiEndpoint}/energy/consumption\`
  );
  return response.json();
}

// Monitor real-time energy metrics
const metrics = await getEnergyData();
console.log('Energy consumption:', metrics);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="size-5" />
                    ZUBA Platform Access
                  </h3>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`// ZUBA Platform Integration
const zubaService = {
  baseUrl: 'https://zuba.reon.capital',
  auth: process.env.ZUBA_API_KEY
};

// Connect to ZUBA services
class ZubaClient {
  constructor(config) {
    this.config = config;
  }
  
  async getData(endpoint) {
    return fetch(\`\${this.config.baseUrl}/\${endpoint}\`, {
      headers: { 'Authorization': \`Bearer \${this.config.auth}\` }
    });
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="size-5" />
                    BEZZA Lightweight Service
                  </h3>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`// BEZZA Lightweight Integration
const bezzaConfig = {
  endpoint: 'https://bezza.reon.capital/api',
  timeout: 5000
};

// Quick service calls
async function callBezzaService(action) {
  try {
    const response = await fetch(
      \`\${bezzaConfig.endpoint}/\${action}\`,
      { timeout: bezzaConfig.timeout }
    );
    return await response.json();
  } catch (error) {
    console.error('BEZZA service error:', error);
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="size-5" />
                    ANSU Enterprise API
                  </h3>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`// ANSU Enterprise Integration
import { AnsuEnterpriseClient } from '@reon/ansu';

const ansuClient = new AnsuEnterpriseClient({
  endpoint: 'https://enterprise.ansu.reon.capital',
  credentials: {
    clientId: process.env.ANSU_CLIENT_ID,
    clientSecret: process.env.ANSU_CLIENT_SECRET
  }
});

// Enterprise data access
const enterpriseData = await ansuClient
  .business.reports
  .generate({ type: 'quarterly', year: 2024 });`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Features */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Integration Features</CardTitle>
              <CardDescription>
                What's available across Reon Capital platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">ENEVA Platform</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Energy data analytics</li>
                    <li>• Real-time monitoring</li>
                    <li>• Resource optimization</li>
                    <li>• Performance tracking</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">ZUBA & BEZZA</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Scalable architecture</li>
                    <li>• Lightweight solutions</li>
                    <li>• Modular design patterns</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">ANSU Enterprise</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Enterprise integrations</li>
                    <li>• Business intelligence</li>
                    <li>• Advanced security</li>
                    <li>• Compliance frameworks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Developer Resources</CardTitle>
              <CardDescription>
                Tools and resources for Reon Capital platform development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/projects/eneva">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Code className="size-4" />
                        ENEVA Documentation
                      </h4>
                      <p className="text-sm text-muted-foreground">Comprehensive energy platform documentation and examples</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/dashboard/projects/ansu">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ExternalLink className="size-4" />
                        ANSU Enterprise
                      </h4>
                      <p className="text-sm text-muted-foreground">Enterprise platform architecture and integration guides</p>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="size-4" />
                      Repository Access
                    </h4>
                    <p className="text-sm text-muted-foreground">Direct access to Bitbucket repositories for all platforms</p>
                  </CardContent>
                </Card>

                <Link href="/dashboard/chat">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Download className="size-4" />
                        Developer Assistant
                      </h4>
                      <p className="text-sm text-muted-foreground">Get help with platform integration and development questions</p>
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
