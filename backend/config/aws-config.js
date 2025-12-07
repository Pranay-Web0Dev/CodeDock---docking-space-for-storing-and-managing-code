// {
//   "Version": "2012-10-17",
//   "Statement": [
//     {
//       "Effect": "Allow",
//       "Principal": {
            // copy from AWS IAM user ARN
//         "AWS": "arn:aws:iam::049405321598:user/Code"
//       },
//       "Action": "s3:*",
//       "Resource": [
            // copy from your S3 bucket ARN
//         "arn:aws:s3:::code-dock",
//         "arn:aws:s3:::code-dock/*"
//       ]
//     }
//   ]
// }


const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION || 'us-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()
const s3Bucket = process.env.S3_BUCKET 

module.exports = {
    s3,
    s3Bucket
}