import {
  CreateUserCommand,
  IAMClient,
  AttachUserPolicyCommand,
  CreateAccessKeyCommand,
  DeleteAccessKeyCommand
} from "@aws-sdk/client-iam";

import 'dotenv/config'

/**
 * AWS User Class
 * 
 * - AWS User class helps to create a User for new registration 
 * and it assigns access policy allowing user's to use s3 bucket to upload Image of blogs.
 * - Everytime a User logs in it creates new Access Key for that Session to work with S3.
 */
class AWSUser {
  #blogpostbuckerreadwritepolicy =
    "arn:aws:iam::951582441276:policy/S3-Bucket-Access-for-Blog-DB";
  constructor() {
    this.client = new IAMClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY,
        secretAccessKey: process.env.AWS_IAM_USER_SECRET_KEY,
      },
    });
  }

  /**
   * Creates a User in AWS and assigns the new User policy S3-Bucket-Access-for-Blog-DB
   * @param {*} username 
   */
  createUser = async (username) => {
    // 1. Create the user
    const createUserCmd = new CreateUserCommand({ UserName: username });
    await this.client.send(createUserCmd);

    // 2. Attach a managed policy
    const attachPolicyCmd = new AttachUserPolicyCommand({
      UserName: username,
      PolicyArn: this.#blogpostbuckerreadwritepolicy,
    });
    await this.client.send(attachPolicyCmd);
  };

  /**
   * Creates new Access Key for User
   * - For every login session - new Access Key is created - and the old one is deleted (to keep access key rotating)
   * - Each new AccessKeyId is stored in DB and SecretKey is embedded in JWT token.
   * @param {*} username 
   * @param {*} oldAccessId 
   * @returns CreateAccessKeyCommandOutput Includes AccessKeyId, SecretAccessKey etc... (Checkout AWS Documentation for CreateAccessKeyCommandOutput)
   */
  createAccessKey = async (username, oldAccessId) => {
    // Delete Old Access Key
    if(oldAccessId) {
        await this.deleteAccessKey(username, oldAccessId);
    }

    // Create new Access Key
    const createNewAccessKey = new CreateAccessKeyCommand({ UserName: username });
    const responseAccessKey = await this.client.send(createNewAccessKey);
    
    return responseAccessKey;
  }

  /**
   * Deletes the old AccessKey from the user
   * @param {*} username 
   * @param {*} oldAccessId 
   */
  deleteAccessKey = async (username, oldAccessId) => {
    const deleteOldAccessKey = new DeleteAccessKeyCommand({ UserName: username, AccessKeyId: oldAccessId});
    await this.client.send(deleteOldAccessKey);
  }
}

const AWSUserObj = new AWSUser();
export default AWSUserObj;
