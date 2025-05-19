"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
// We'll initialize the S3 client later with the correct region
let s3Client;
// Ajouter la constante CloudFront
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || "https://diwa7aolcke5u.cloudfront.net/";
const handler = async (event) => {
    try {
        // Ajouter plus de logs pour debugging
        console.log("Event received:", JSON.stringify(event, null, 2));
        // Parse request body
        const body = JSON.parse(event.body || "{}");
        const { fileUrl, bucketName, directory = "" } = body;
        console.log("Request parameters:", { fileUrl, bucketName, directory });
        // Validate inputs
        if (!fileUrl || !bucketName) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST",
                },
                body: JSON.stringify({
                    error: "Missing required parameters: fileUrl and bucketName",
                }),
            };
        }
        // Variable to store the determined region
        let regionString = "us-east-1";
        // First, determine the correct region for the bucket
        try {
            // Start with default region
            regionString = process.env.AWS_REGION || "us-east-1";
            s3Client = new client_s3_1.S3Client({
                region: regionString,
                // Log all requests for debugging
                logger: console,
            });
            console.log("Initial S3 client region:", regionString);
            // Try to access the bucket to see if it exists in this region
            console.log("Checking bucket existence in region:", regionString);
            await s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: bucketName }));
            console.log("Bucket found in region:", regionString);
        }
        catch (error) {
            console.log("Error when checking bucket:", error);
            if (error instanceof Error &&
                error.message.includes("PermanentRedirect")) {
                // Extract region from error message if possible
                const regionMatch = /endpoint: "(.+)\.amazonaws\.com/.exec(error.message);
                if (regionMatch && regionMatch[1]) {
                    regionString = regionMatch[1].replace("s3.", "");
                    console.log(`Bucket is in a different region: ${regionString}`);
                    // Reinitialize with correct region
                    s3Client = new client_s3_1.S3Client({
                        region: regionString,
                        logger: console,
                    });
                }
                else {
                    // If we can't extract region, use specific regions based on bucket name
                    // For example, if bucket name contains "ap" or "tokyo", use ap-northeast-1
                    if (bucketName.includes("ap") || bucketName.includes("asia")) {
                        regionString = "ap-northeast-1";
                        s3Client = new client_s3_1.S3Client({ region: regionString, logger: console });
                    }
                    else if (bucketName.includes("eu") ||
                        bucketName.includes("europe")) {
                        regionString = "eu-west-1";
                        s3Client = new client_s3_1.S3Client({ region: regionString, logger: console });
                    }
                    else {
                        // Try other common regions
                        regionString = "us-west-1";
                        console.log("Could not determine region, trying us-west-1");
                        s3Client = new client_s3_1.S3Client({ region: regionString, logger: console });
                    }
                }
            }
            else if (error instanceof Error && error.message.includes("403")) {
                // Permission issues
                console.error("Permission denied to access bucket. Check IAM role and bucket policy:", error);
                throw new Error(`Access denied to bucket ${bucketName}. Check permissions and make sure bucket exists: ${error.message}`);
            }
            else {
                // Some other error, just throw it
                console.error("Bucket check failed with error:", error);
                throw error;
            }
        }
        // Download file from URL
        console.log("Downloading file from URL:", fileUrl);
        try {
            var response = await axios_1.default.get(fileUrl, { responseType: "arraybuffer" });
            console.log("Download successful, content type:", response.headers["content-type"], "Size:", response.data.length);
        }
        catch (downloadError) {
            console.error("File download failed:", downloadError);
            throw new Error(`Failed to download file from URL: ${downloadError instanceof Error ? downloadError.message : String(downloadError)}`);
        }
        const fileContent = response.data;
        // Generate a unique filename while preserving extension
        const originalFilename = path.basename(new URL(fileUrl).pathname);
        const fileExtension = path.extname(originalFilename);
        const uniqueFilename = `${(0, uuid_1.v4)()}${fileExtension}`;
        // Format the directory path (ensure it has trailing slash if not empty)
        const dirPath = directory
            ? directory.endsWith("/")
                ? directory
                : `${directory}/`
            : "";
        // Use the S3 client with the correct region
        console.log(`Using region string: ${regionString} for bucket: ${bucketName}`);
        // Upload to S3 with directory prefix if specified
        const key = `${dirPath}${uniqueFilename}`;
        console.log("S3 upload parameters:", {
            bucket: bucketName,
            key: key,
            contentType: response.headers["content-type"],
        });
        let uploadParams;
        try {
            // First try without ACL (newer buckets might have ACL disabled)
            uploadParams = {
                Bucket: bucketName,
                Key: key,
                Body: fileContent,
                ContentType: response.headers["content-type"],
            };
            console.log("Attempting upload without ACL first");
            await s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
            console.log("Upload to S3 successful without ACL");
        }
        catch (uploadError) {
            console.log("Upload without ACL failed, trying with ACL:", uploadError);
            if (uploadError instanceof Error && uploadError.message.includes("403")) {
                // This could be because ACLs are not enabled on the bucket, or the IAM role doesn't have permission
                console.error("Permission denied. Check if bucket has ACL enabled and IAM permissions:", uploadError);
                throw new Error(`Access denied while uploading to ${bucketName}. Make sure ACLs are enabled on the bucket and check IAM permissions: ${uploadError.message}`);
            }
            // Try with ACL
            try {
                uploadParams = {
                    Bucket: bucketName,
                    Key: key,
                    Body: fileContent,
                    ContentType: response.headers["content-type"],
                    ACL: "public-read",
                };
                await s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
                console.log("Upload to S3 successful with ACL");
            }
            catch (aclUploadError) {
                console.error("S3 upload failed with ACL:", aclUploadError);
                if (aclUploadError instanceof Error &&
                    aclUploadError.message.includes("AccessControlListNotSupported")) {
                    // ACLs are not supported on this bucket
                    console.error("This bucket does not support ACLs. Upload without ACL and update bucket policy to make objects public.");
                    throw new Error(`The bucket ${bucketName} does not support ACLs. Configure the bucket to allow public access through bucket policy instead: ${aclUploadError.message}`);
                }
                throw new Error(`Failed to upload to S3: ${aclUploadError instanceof Error ? aclUploadError.message : String(aclUploadError)}`);
            }
        }
        // Generate the public URL with the correct region string
        // const s3Url = `https://${bucketName}.s3.${regionString}.amazonaws.com/${key}`
        // Utiliser CloudFront à la place de l'URL S3
        const cloudfrontUrl = `${CLOUDFRONT_URL.replace(/\/$/, "")}/${key}`;
        console.log("Generated CloudFront URL:", cloudfrontUrl);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            body: JSON.stringify({
                message: "File uploaded successfully",
                fileUrl: cloudfrontUrl,
            }),
        };
    }
    catch (error) {
        console.error("Main handler error:", error);
        let errorMessage = "Unknown error occurred";
        let errorDetails = "";
        if (error instanceof Error) {
            errorMessage = error.message;
            errorDetails = error.stack || "";
        }
        else if (typeof error === "string") {
            errorMessage = error;
        }
        else if (error && typeof error === "object") {
            errorMessage = JSON.stringify(error);
        }
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            body: JSON.stringify({
                error: "Failed to upload file to S3",
                message: errorMessage,
                details: errorDetails,
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=index.js.map