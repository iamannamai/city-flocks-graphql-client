# Uploading to S3

## Motivation
An earlier approach used `react-native-aws3` a, now minimally supported library, that required providing the access key Id and the secret key straight into a configuration that was loaded in a component. This is a security concern we should avoid if possible. The alternative approach is a middle ground achieved by utilizing **Amplify**, a library that provides a declarative approach to building web/mobile services that use AWS services.

## Approach
1. Create S3 Bucket and set up CORS permissions. Keep bucket permissions restricted to an IAM user.
2. Create Identity Federation/Pool in AWS
  - Permission auth and noauth roles to be able to access the necessary S3 bucket (read & write)
3. Import `aws-amplify` into `App.js`
  - Configure with `Auth` (Identity Pool info) and `Storage` (Bucket info). See configs for more details

Access of S3 bucket should be available

## Saving photo to S3
1. In CameraView component, import `aws-amplify`.
2. Take photo uri (resolve expo's `takePhotoAsync`) and pass to function that blobifies photo.
3. Pass file name/path, blob, and options (include content-type!) to `aws-amplify`'s `Storage` api.
  - Should compose file by taking `<teamname>/<eventname>/<taskname>.jpg`
  - Full album would then be `<teamname>/<eventname>`
4. Response is S3 key (file path relative to bucket), which can then be saved to the db for later retrieval.

## Retrieving photo
???
S3Image?
