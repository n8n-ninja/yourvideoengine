import type { IExecuteFunctions, IWebhookFunctions, INodeTypeDescription, INodeExecutionData, IWebhookResponseData } from "n8n-workflow";
export declare class YVEWait {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
