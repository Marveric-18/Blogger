import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3Bucket Service to serve S3 Bucket for Users
 * To initialize it needs user's accesskey and secret key
 */
class S3Bucket {
  #bucketName = "blogs-db";

  constructor(accessKeyId, secretAccessKey) {
    this.s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  /**
   * It generates presigned urls with PutObjectCommand so that it can be used by frontend origin to upload the file
   * @param {*} fileName 
   * @param {*} fileType 
   * @returns signedUrl String(URL)
   */
  getUploadSignedUrl = async(fileName, fileType) => {
    const prepareSignedUrlCommand = new PutObjectCommand({
        Bucket: this.#bucketName,
        Key: fileName,
        ContentType: fileType
    })
    const signedUrl = await getSignedUrl(this.s3Client, prepareSignedUrlCommand, { expiresIn: 300 });
    return signedUrl;
  }

  /**
   * It generates presigned urls with GetObjectCommand so that it can be used by frontend origin to download/fetch the file
   * @param {*} fileUrl 
   * @returns 
   */
  getDownloadSignedUrl =  async(fileUrl) => {
    const key = new URL(fileUrl).pathname.slice(1);
    const decodedKey = decodeURIComponent(key);
    const prepareSignedUrlCommand = new GetObjectCommand({
        Bucket: this.#bucketName,
        Key: decodedKey
    });
    const signedUrl = await getSignedUrl(this.s3Client, prepareSignedUrlCommand, { expiresIn: 300 });
    return signedUrl;
  }
}


export default S3Bucket;