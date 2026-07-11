import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code, Smartphone, MonitorCog, Cloud, Braces } from "lucide-react"

const nodeSample = `import fetch from "node-fetch";

async function fetchCustomer(customerId: string, token: string) {
  const res = await fetch("https://api.eneva.energy/customers/" + customerId, {
    method: "GET",
    headers: {
      Authorization: ` + "`Bearer ${token}`" + `,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
}`

const flutterSample = `class BillingService {
  final http.Client _client;

  BillingService(this._client);

  Future<void> submitMeterReading({
    required String meterId,
    required double value,
    required String token,
  }) async {
    final res = await _client.post(
      Uri.parse('https://api.eneva.energy/meters/$meterId/readings'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'value_kwh': value,
        'captured_at': DateTime.now().toUtc().toIso8601String(),
      }),
    );

    if (res.statusCode != 201) {
      throw Exception('Reading submission failed');
    }
  }
}`

const curlSample = `curl --request POST \\
  --url https://api.eneva.energy/oauth/token \\
  --header 'content-type: application/json' \\
  --data '{
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "grant_type": "client_credentials"
  }'`

const integrationIdeas = [
  {
    title: "Customer 360 dashboards",
    description: "Merge ENEVA billing data with CRM insights to highlight churn risks",
    stack: ["Node.js", "BigQuery", "Looker"],
  },
  {
    title: "Meter maintenance alerts",
    description: "Trigger Slack notifications when meter alerts fire more than three times in a day",
    stack: ["Cloud Functions", "Slack", "Firebase"],
  },
  {
    title: "Partner billing portal",
    description: "Expose billing summaries to partners via a branded portal",
    stack: ["Next.js", "LaunchDarkly", "Stripe"],
  },
]

export default function EnevaApiExamplesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ENEVA API Examples</h1>
          <p className="text-muted-foreground max-w-3xl">
            Ready-made snippets you can copy into dashboards, mobile apps, and backend jobs. Each tab mirrors the stacks we support internally so external partners see exactly how we integrate.
          </p>
        </div>

        <Tabs defaultValue="node" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="node">Node</TabsTrigger>
            <TabsTrigger value="flutter">Flutter</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="ideas">Integration Ideas</TabsTrigger>
          </TabsList>

          <TabsContent value="node" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="size-5" />
                  Node.js client
                </CardTitle>
                <CardDescription>Fetch customer details from a server-to-server integration</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{nodeSample}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flutter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="size-5" />
                  Flutter billing service
                </CardTitle>
                <CardDescription>Submit meter readings from the Eneva-core-app client</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{flutterSample}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curl" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="size-5" />
                  Obtain access token
                </CardTitle>
                <CardDescription>Quick cURL example to retrieve a client credentials token</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">{curlSample}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Braces className="size-5" />
                  Integration Blueprints
                </CardTitle>
                <CardDescription>Starter ideas to inspire partner integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {integrationIdeas.map((idea) => (
                    <div key={idea.title} className="rounded-lg border border-border/40 bg-primary/5 p-5">
                      <h3 className="text-lg font-semibold">{idea.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {idea.stack.map((item) => (
                          <Badge key={item} variant="secondary">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
