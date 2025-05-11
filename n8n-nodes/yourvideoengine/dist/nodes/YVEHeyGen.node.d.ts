import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from "n8n-workflow";
export declare class YVEHeyGen implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
