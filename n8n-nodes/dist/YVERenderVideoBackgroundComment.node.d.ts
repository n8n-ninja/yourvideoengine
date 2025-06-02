import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
export declare class YVERenderVideoBackgroundComment implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
