const IDENTITY_POOL_ID = 'us-east-1:3a35d6c1-01ec-4778-a511-3d9ee56ff080';
const REGION = 'us-east-1';
const BUCKET = 'city-flocks';


export default {
  keyPrefix: '',
  bucket: process.env.AWS_S3_BUCKET,
  region: REGION,
  accessKey: process.env.AWS_S3_ACCESS_KEY,
  secretKey: process.env.AWS_S3_SECRET_KEY,
  successActionStatus: 201
};

export const authConfig = {
  identityPoolId: IDENTITY_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
  region: REGION, // REQUIRED - Amazon Cognito Region
};

export const storageConfig = {
  AWSS3: {
    bucket: BUCKET, //REQUIRED -  Amazon S3 bucket
    region: REGION, //OPTIONAL -  Amazon service region
  }
};
