import { YVEVideoCaptions } from "./nodes/YVEVideoCaptions.node"
import { YVEHeyGen } from "./nodes/YVEHeyGen.node"
import { YVEHeyGenApi } from "./credentials/YVEHeyGenApi.credentials"

export const nodes = [YVEVideoCaptions, YVEHeyGen]
export const credentials = [YVEHeyGenApi]
