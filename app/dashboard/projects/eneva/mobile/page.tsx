import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  Users, 
  Shield, 
  Globe, 
  Activity, 
  Phone, 
  Camera, 
  MapPin,
  CheckCircle,
  ExternalLink,
  GitBranch,
  Package,
  Code,
  Settings,
  Download,
  Zap,
  Database,
  BarChart3,
  Wrench,
  Building,
  DollarSign
} from "lucide-react"
import Link from "next/link"

export default function EnevaMobileAppPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ENEVA Mobile Applications</h1>
          <p className="text-muted-foreground mt-2">
            Flutter-based mobile applications for customers and field operations
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer-app">Customer App</TabsTrigger>
            <TabsTrigger value="internal-app">Internal App</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="setup">Setup & Development</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Mobile Apps Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Applications Overview
                </CardTitle>
                <CardDescription>
                  Two Flutter-based mobile applications serving different user groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Customer Mobile App</h4>
                        <p className="text-sm text-muted-foreground">(Eneva-app)</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>• Electricity bill payments via mobile money</div>
                      <div>• Real-time energy consumption tracking</div>
                      <div>• Usage history and analytics</div>
                      <div>• Multi-language support (English/Somali)</div>
                      <div>• WhatsApp OTP authentication</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Flutter • Customer-facing</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Internal Mobile App</h4>
                        <p className="text-sm text-muted-foreground">(Eneva-core-app)</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>• Field meter reading with GPS tracking</div>
                      <div>• Customer profile management</div>
                      <div>• Job assignment and tracking</div>
                      <div>• Photo documentation capabilities</div>
                      <div>• Offline functionality with sync</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Flutter • Employee-facing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shared Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Shared Architecture
                </CardTitle>
                <CardDescription>
                  Common backend services and authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="text-center space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Customer App</h4>
                        <p className="text-sm text-blue-600">Eneva-app</p>
                      </div>
                      <div className="bg-green-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800">Internal App</h4>
                        <p className="text-sm text-green-600">Eneva-core-app</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="text-gray-400 text-2xl">↓</div>
                    </div>
                    
                    <div className="bg-orange-100 p-4 rounded-lg max-w-md mx-auto">
                      <h4 className="font-semibold text-orange-800">Shared Backend API</h4>
                      <p className="text-sm text-orange-600">Node.js/TypeScript</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="text-gray-400 text-2xl">↓</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800">Firebase</h4>
                        <p className="text-sm text-red-600">Auth + Firestore</p>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800">BigQuery</h4>
                        <p className="text-sm text-purple-600">Analytics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer-app" className="space-y-6">
            {/* Customer App Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Customer Mobile App (Eneva-app)
                </CardTitle>
                <CardDescription>
                  Flutter application for electricity customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Core Features</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <h5 className="font-medium">Mobile Money Payments</h5>
                            <p className="text-sm text-muted-foreground">Secure electricity bill payments</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium">Energy Tracking</h5>
                            <p className="text-sm text-muted-foreground">Real-time consumption monitoring</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-purple-600" />
                          <div>
                            <h5 className="font-medium">Multi-language</h5>
                            <p className="text-sm text-muted-foreground">English and Somali support</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-orange-600" />
                          <div>
                            <h5 className="font-medium">WhatsApp OTP</h5>
                            <p className="text-sm text-muted-foreground">Authentication via WhatsApp</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">User Experience</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Intuitive dashboard with usage overview</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Bill payment history and receipts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Usage patterns and analytics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Notifications for bills and outages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Customer support integration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Technical Implementation</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium">State Management</h5>
                        <p>Riverpod for reactive state management</p>
                      </div>
                      <div>
                        <h5 className="font-medium">Navigation</h5>
                        <p>GoRouter for declarative routing</p>
                      </div>
                      <div>
                        <h5 className="font-medium">UI Framework</h5>
                        <p>Custom design system with animations</p>
                      </div>
                      <div>
                        <h5 className="font-medium">Data Persistence</h5>
                        <p>Firebase integration with offline support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internal-app" className="space-y-6">
            {/* Internal App Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Internal Mobile App (Eneva-core-app)
                </CardTitle>
                <CardDescription>
                  Flutter application for utility company employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Field Operations</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-600" />
                          <div>
                            <h5 className="font-medium">Meter Reading</h5>
                            <p className="text-sm text-muted-foreground">GPS-tracked meter readings</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Camera className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium">Photo Documentation</h5>
                            <p className="text-sm text-muted-foreground">Visual evidence capture</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-purple-600" />
                          <div>
                            <h5 className="font-medium">Location Tracking</h5>
                            <p className="text-sm text-muted-foreground">GPS coordinates for all activities</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-orange-600" />
                          <div>
                            <h5 className="font-medium">Offline Capability</h5>
                            <p className="text-sm text-muted-foreground">Work without internet connection</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Management Features</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Customer profile access and management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Job assignment and status updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Meter installation and maintenance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Real-time data synchronization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Performance tracking and reporting</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Employee Workflow</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-lg mb-2">
                          <Download className="h-5 w-5 text-blue-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Download Jobs</h5>
                        <p className="text-xs text-muted-foreground">Sync assigned tasks</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-lg mb-2">
                          <MapPin className="h-5 w-5 text-green-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Navigate</h5>
                        <p className="text-xs text-muted-foreground">GPS to customer location</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-lg mb-2">
                          <Activity className="h-5 w-5 text-purple-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Execute</h5>
                        <p className="text-xs text-muted-foreground">Complete field tasks</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 p-3 rounded-lg mb-2">
                          <Database className="h-5 w-5 text-orange-600 mx-auto" />
                        </div>
                        <h5 className="font-medium">Sync</h5>
                        <p className="text-xs text-muted-foreground">Upload completed work</p>
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
                  Mobile Technology Stack
                </CardTitle>
                <CardDescription>
                  Flutter and Dart ecosystem with Firebase integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Core Framework</h4>
                    <div className="space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">Flutter 3.24.0+</Badge>
                      <Badge className="bg-cyan-100 text-cyan-800">Dart 3.2.2+</Badge>
                      <Badge className="bg-green-100 text-green-800">Material Design 3</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">State Management</h4>
                    <div className="space-y-2">
                      <Badge className="bg-purple-100 text-purple-800">Riverpod (Customer)</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">Provider (Internal)</Badge>
                      <Badge className="bg-pink-100 text-pink-800">GoRouter</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Backend Services</h4>
                    <div className="space-y-2">
                      <Badge className="bg-orange-100 text-orange-800">Firebase Auth</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">Firestore</Badge>
                      <Badge className="bg-red-100 text-red-800">Firebase Storage</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Device Features</h4>
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-800">Camera Integration</Badge>
                      <Badge className="bg-blue-100 text-blue-800">GPS & Location</Badge>
                      <Badge className="bg-purple-100 text-purple-800">Local Storage</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">UI Components</h4>
                    <div className="space-y-2">
                      <Badge className="bg-teal-100 text-teal-800">Custom Design System</Badge>
                      <Badge className="bg-gray-100 text-gray-800">SVG Graphics</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">Animations</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Platform Support</h4>
                    <div className="space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">Android</Badge>
                      <Badge className="bg-gray-100 text-gray-800">iOS</Badge>
                      <Badge className="bg-green-100 text-green-800">Cross-platform</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Development Tools & Environment
                </CardTitle>
                <CardDescription>
                  Tools and setup for Flutter mobile development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Required Tools</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Flutter SDK 3.24.0+</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-green-600" />
                        <span>Android Studio / VS Code</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-600" />
                        <span>Xcode (iOS development)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-600" />
                        <span>Firebase CLI</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Development Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Hot reload for instant updates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Flutter DevTools for debugging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Dart analyzer for code quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Automated testing framework</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            {/* Setup & Development */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Development Setup
                </CardTitle>
                <CardDescription>
                  Step-by-step guide for Flutter mobile development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Prerequisites</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm font-mono">
                        <div>Flutter SDK &gt;= 3.24.0</div>
                        <div>Dart SDK &gt;= 3.2.2</div>
                        <div>Android Studio / VS Code</div>
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
                        <div>cd eneva/Eneva-app  # For customer app</div>
                        <div># OR</div>
                        <div>cd eneva/Eneva-core-app  # For internal app</div>
                        <div className="my-2"></div>
                        <div># 2. Install dependencies</div>
                        <div>flutter pub get</div>
                        <div className="my-2"></div>
                        <div># 3. Configure Firebase</div>
                        <div>flutterfire configure</div>
                        <div className="my-2"></div>
                        <div># 4. Run the app</div>
                        <div>flutter run</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Customer App Commands</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm font-mono">
                          <div>flutter run -d android</div>
                          <div>flutter run -d ios</div>
                          <div>flutter build apk</div>
                          <div>flutter build ipa</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Internal App Commands</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm font-mono">
                          <div>flutter run --debug</div>
                          <div>flutter run --release</div>
                          <div>flutter test</div>
                          <div>flutter analyze</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Firebase Configuration</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div><strong>1.</strong> Install Firebase CLI: <code>npm install -g firebase-tools</code></div>
                        <div><strong>2.</strong> Login to Firebase: <code>firebase login</code></div>
                        <div><strong>3.</strong> Install FlutterFire CLI: <code>dart pub global activate flutterfire_cli</code></div>
                        <div><strong>4.</strong> Configure project: <code>flutterfire configure</code></div>
                        <div><strong>5.</strong> Select your Firebase project and platforms</div>
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
