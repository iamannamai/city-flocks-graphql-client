export default {
  keyPrefix: '',
  bucket: process.env.AWS_S3_BUCKET,
  region: 'us-east-1',
  accessKey: process.env.AWS_S3_ACCESS_KEY,
  secretKey: process.env.AWS_S3_SECRET_KEY,
  successActionStatus: 201
};

