import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"

const snippetGroups = [
  {
    id: "server-actions",
    label: "Server Actions",
    description: "Reusable patterns for API mutations with optimistic UI updates.",
    code: `"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createProject(input: CreateProjectInput) {
  const project = await db.project.create({ data: input })
  revalidatePath("/dashboard/projects")
  return project
}`,
  },
  {
    id: "client-hooks",
    label: "Client Hooks",
    description: "State management patterns for the dashboard sidebar and chat widgets.",
    code: `import { useEffect, useState } from "react"
import { getSidebarState } from "@/lib/chat-store"

export function useSidebar() {
  const [state, setState] = useState(getSidebarState())

  useEffect(() => {
    const unsubscribe = getSidebarState.subscribe(setState)
    return () => unsubscribe()
  }, [])

  return state
}`,
  },
  {
    id: "styling",
    label: "Styling",
    description: "Consistent card layouts that match the Developer Hub aesthetic.",
    code: `import { cn } from "@/lib/utils"

export function Section({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("rounded-xl border border-border/40 bg-background/80 p-6 shadow-sm", className)}
      {...props}
    />
  )
}`,
  },
]

export default function CodeSnippetsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Code Snippets</h1>
          <p className="text-muted-foreground max-w-3xl">
            Copy-ready snippets curated from live features. Each example follows the same patterns used across ENEVA, ZUBA, and BEZZA.
          </p>
        </div>

        <Tabs defaultValue={snippetGroups[0]?.id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {snippetGroups.map((group) => (
              <TabsTrigger key={group.id} value={group.id}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {snippetGroups.map((group) => (
            <TabsContent key={group.id} value={group.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="size-5" />
                    {group.label}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded bg-muted p-4 text-sm leading-6">
                    <code>{group.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
