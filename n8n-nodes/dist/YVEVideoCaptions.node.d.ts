import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
export declare class YVEVideoCaptions implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
