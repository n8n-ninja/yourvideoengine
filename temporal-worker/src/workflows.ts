import { proxyActivities } from "@temporalio/workflow"
import type * as activities from "./activities"

const { helloActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: "5 seconds",
})

export async function helloWorkflow(name: string): Promise<string> {
  return await helloActivity(name)
}
