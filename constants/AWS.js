import { Auth, Storage } from 'aws-amplify';

Auth.configure(
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
  region: 'XX-XXXX-X',
);

Storage.configure({
  AWSS3: {
      bucket: '',//Your bucket name;
      region: ''//Specify the region your bucket was created in;
  }
});

export Storage;
