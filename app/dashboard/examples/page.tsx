import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Github, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"

export default function ExamplesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">ENEVA Code Examples</h1>
          <p className="text-muted-foreground mt-2">
            Real-world examples and templates for ENEVA platform integrations
          </p>
        </div>

        <div className="grid gap-6">
          {/* ENEVA Sample Applications */}
          <Card>
            <CardHeader>
              <CardTitle>ENEVA Sample Applications</CardTitle>
              <CardDescription>
                Complete applications demonstrating ENEVA platform integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Customer Mobile App</CardTitle>
                      <Badge variant="secondary">Flutter</Badge>
                    </div>
                    <CardDescription>
                      Mobile app for ENEVA customers to view bills and manage accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm">
                        git clone https://bitbucket.org/reon-dev/eneva/src/main/Eneva-app/
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Github className="size-4 mr-1" />
                        View Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="size-4 mr-1" />
                        App Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Core Operations App</CardTitle>
                      <Badge variant="secondary">Flutter</Badge>
                    </div>
                    <CardDescription>
                      Internal app for meter readings and field operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm">
                        git clone https://bitbucket.org/reon-dev/eneva/src/main/Eneva-core-app/
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Github className="size-4 mr-1" />
                        View Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="size-4 mr-1" />
                        Internal Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Web Dashboard</CardTitle>
                      <Badge variant="secondary">React</Badge>
                    </div>
                    <CardDescription>
                      Web-based analytics and management dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm">
                        git clone https://bitbucket.org/reon-dev/eneva/src/main/Eneva-core-web/
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Github className="size-4 mr-1" />
                        View Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="size-4 mr-1" />
                        Live Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Backend API</CardTitle>
                      <Badge variant="secondary">Node.js</Badge>
                    </div>
                    <CardDescription>
                      RESTful API with Firebase integration and cloud functions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm">
                        git clone https://bitbucket.org/reon-dev/eneva/src/main/Backend/
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Github className="size-4 mr-1" />
                        View Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="size-4 mr-1" />
                        API Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card>
            <CardHeader>
              <CardTitle>Code Snippets</CardTitle>
              <CardDescription>
                Common patterns and use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ENEVA API Authentication Example */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Code className="size-5" />
                  ENEVA API Authentication
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">JavaScript</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-green-400 overflow-x-auto">
{`// ENEVA API Authentication
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@eneva.com',
    password: 'password'
  })
});

const { token } = await authResponse.json();
console.log('Access token:', token);`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Flutter</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-blue-400 overflow-x-auto">
{`// Flutter HTTP Authentication
class AuthService {
  static Future<String> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('\${baseUrl}/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password})
    );
    
    final data = json.decode(response.body);
    return data['token'];
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Data Fetching Example */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Code className="size-5" />
                  Customer & Billing Data
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">React</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-yellow-400 overflow-x-auto">
{`// Fetch customer billing data
const fetchCustomerBills = async (customerId) => {
  const response = await fetch(\`/api/customers/\${customerId}/bills\`, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  
  return response.json();
};

// Generate new bill
const generateBill = async (customerId, month) => {
  const response = await fetch('/api/billing/generate', {
    method: 'POST',
    headers: { 
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ customerId, month })
  });
  
  return response.json();
};`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Flutter</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-blue-400 overflow-x-auto">
{`// Customer service class
class CustomerService {
  static Future<List<Bill>> getCustomerBills(String customerId) async {
    final response = await http.get(
      Uri.parse('\${baseUrl}/api/customers/\$customerId/bills'),
      headers: {'Authorization': 'Bearer \$token'}
    );
    
    final data = json.decode(response.body);
    return data.map<Bill>((bill) => Bill.fromJson(bill)).toList();
  }
  
  static Future<Customer> getCustomerProfile(String customerId) async {
    final response = await http.get(
      Uri.parse('\${baseUrl}/api/customers/\$customerId'),
      headers: {'Authorization': 'Bearer \$token'}
    );
    
    return Customer.fromJson(json.decode(response.body));
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Firebase Cloud Functions Example */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Code className="size-5" />
                  Firebase Cloud Functions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">TypeScript</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-green-400 overflow-x-auto">
{`// Bill generation cloud function
export const generateMonthlyBills = functions.firestore
  .document('billingMonths/{monthId}')
  .onCreate(async (snap, context) => {
    const monthData = snap.data();
    const customers = await getActiveCustomers();
    
    for (const customer of customers) {
      const consumption = await getMeterReadings(customer.meterId);
      const bill = calculateBill(customer, consumption, monthData);
      
      await saveBill(bill);
      await sendBillNotification(customer, bill);
    }
    
    return { success: true, billsGenerated: customers.length };
  });`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">TypeScript</Badge>
                      <Button size="sm" variant="outline">
                        <Copy className="size-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <pre className="text-sm text-green-400 overflow-x-auto">
{`// Meter reading sync function
export const syncMeterReadings = functions.https.onRequest(async (req, res) => {
  try {
    const { meterId, readings } = req.body;
    
    // Validate readings
    const validatedReadings = await validateReadings(readings);
    
    // Save to Firestore
    await admin.firestore()
      .collection('meters')
      .doc(meterId)
      .collection('readings')
      .add({
        readings: validatedReadings,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        source: 'mobile_app'
      });
    
    res.json({ success: true, readingsSaved: validatedReadings.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ENEVA Integration Templates */}
          <Card>
            <CardHeader>
              <CardTitle>ENEVA Integration Templates</CardTitle>
              <CardDescription>
                Pre-built templates for common ENEVA integration scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Customer Portal</CardTitle>
                    <CardDescription>
                      Flutter template for customer-facing mobile app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Flutter</Badge>
                      <Badge variant="secondary">Dart</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Github className="size-4 mr-1" />
                      Get Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                    <CardDescription>
                      React template for energy consumption analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Vite</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Github className="size-4 mr-1" />
                      Get Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Billing Service</CardTitle>
                    <CardDescription>
                      Node.js microservice for billing operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Firebase</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Github className="size-4 mr-1" />
                      Get Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
