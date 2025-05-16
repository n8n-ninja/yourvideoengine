import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeExecutionData,
} from "n8n-workflow"

export class YVECamera implements INodeType {
  description: INodeTypeDescription = {
    displayName: "YVE Render",
    name: "yveRender",
    icon: "file:camera.svg",
    group: ["transform"],
    version: 1,
    description: "Pilot Remotion Render composition with keyframes.",
    defaults: {
      name: "YVE Render",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: "Scenes",
        name: "scenes",
        type: "json",
        default: "[]",
        description: "Scenes to render.",
        required: true,
      },
      {
        displayName: "Global",
        name: "global",
        type: "json",
        default: "{}",
        description: "Global settings to render.",
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []
    for (let i = 0; i < items.length; i++) {
      const videoUrl = this.getNodeParameter("videoUrl", i) as string
      let keyframes = this.getNodeParameter("keyframes", i) as any
      if (typeof keyframes === "string") {
        try {
          keyframes = JSON.parse(keyframes)
        } catch (e) {
          throw new Error("Keyframes is not valid JSON: " + e)
        }
      }
      // Get video duration (optional, can be improved)
      let duration = 0
      try {
        const body: Record<string, unknown> = { url: videoUrl }
        const durationResponse = await this.helpers.httpRequest({
          method: "POST",
          url: `http://n04sg488kwcss8ow04kk4c8k.91.107.237.123.sslip.io/duration`,
          headers: {
            Authorization: "Bearer sk_live_2b87210c8f3e4d3e9a23a09d5cf7d144",
          },
          body,
          json: true,
        })
        duration = durationResponse.duration
      } catch (e) {
        // fallback: 0
      }
      const inputProps: any = {
        videoUrl,
        keyframes,
      }
      const remotionPayload = {
        serveUrl:
          "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
        composition: "CameraZoom",
        framesPerLambda: 12,
        inputProps: inputProps,
        durationInFrames: duration ? Math.round(duration * 30) : undefined,
      }
      // Remotion response
      const remotionResponse = await this.helpers.httpRequest({
        method: "POST",
        url: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render",
        headers: {
          "Content-Type": "application/json",
        },
        body: remotionPayload,
        json: true,
      })
      // Output file
      let outputFile = null
      let statusData = null
      if (remotionResponse.statusUrl) {
        const statusUrl = remotionResponse.statusUrl
        const start = Date.now()
        const timeout = 5 * 60 * 1000 // 5 minutes
        while (Date.now() - start < timeout) {
          await new Promise((r) => setTimeout(r, 10000)) // 10s
          try {
            statusData = await this.helpers.httpRequest({
              method: "GET",
              url: statusUrl,
              json: true,
            })
            if (statusData.done && statusData.outputFile) {
              outputFile = statusData.outputFile
              break
            }
          } catch (e) {
            break
          }
        }
      }
      if (outputFile) {
        returnData.push({
          json: {
            video_url: outputFile,
            status: statusData,
          },
        })
      } else {
        returnData.push({
          json: {
            remotion: remotionResponse,
            status: statusData,
          },
        })
      }
    }
    return this.prepareOutputData(returnData)
  }
}
