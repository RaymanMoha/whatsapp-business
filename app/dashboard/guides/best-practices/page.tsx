import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, GitPullRequest, ShieldCheck, Sparkles } from "lucide-react"

const codeQualityPrinciples = [
  {
    title: "Readable modules",
    points: [
      "Prefer server actions over ad-hoc fetch calls inside components",
      "Co-locate tests with the feature and mirror folder names",
      "Keep React server components async and free of browser APIs",
    ],
  },
  {
    title: "Consistent UI patterns",
    points: [
      "Reuse primitives from the ui library before adding new dependencies",
      "Use Tabs and Cards for dashboard sections to match the design system",
      "Annotate complex layouts with brief comments to guide future edits",
    ],
  },
]

const deliveryHabits = [
  {
    title: "Pull request hygiene",
    highlights: [
      "Keep PRs under 400 lines and describe screenshots or recordings",
      "Tag `@platform-reviewers` for shared components changes",
      "Link Notion spec or Linear ticket for every feature branch",
    ],
  },
  {
    title: "Testing",
    highlights: [
      "Run `pnpm lint` and `pnpm test` in CI before requesting review",
      "Add Playwright coverage when shipping new flows or modals",
      "Capture data mocks in `lib/` so local fixtures stay reusable",
    ],
  },
]

const securityChecklist = [
  {
    label: "Secrets handling",
    description: "Never commit `.env` files. Rotate API keys via the internal automation script.",
    badge: "Required",
  },
  {
    label: "Dependency review",
    description: "Audit `pnpm diff --filter dev` output for new packages before merge.",
    badge: "Every release",
  },
  {
    label: "Access control",
    description: "Use role guard utilities from `lib/auth.ts` for privileged dashboard routes.",
    badge: "Ongoing",
  },
]

export default function BestPracticesGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Developer Best Practices</h1>
          <p className="text-muted-foreground max-w-3xl">
            Core habits that keep the Developer Hub, ENEVA, ZUBA, and BEZZA codebases healthy. These guidelines pair with the deployment and troubleshooting guides to form the complete engineering playbook.
          </p>
        </div>

        <Tabs defaultValue="quality" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quality">Code Quality</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="quality" className="space-y-6">
            {codeQualityPrinciples.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>Apply these before opening a pull request</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            {deliveryHabits.map((area) => (
              <Card key={area.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitPullRequest className="size-5" />
                    {area.title}
                  </CardTitle>
                  <CardDescription>High-signal habits for collaborative shipping</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
                    {area.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  Security checklist
                </CardTitle>
                <CardDescription>Review during pre-merge and before production deploys</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {securityChecklist.map((item) => (
                  <div key={item.label} className="rounded-lg border border-border/40 bg-secondary/10 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        {item.label}
                      </h3>
                      <Badge variant="outline">{item.badge}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
