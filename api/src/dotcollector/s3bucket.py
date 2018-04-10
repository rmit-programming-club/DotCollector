import os
import boto3
import botocore

s3 = boto3.resource('s3')
bucket_name = ''
if 'BucketName' in os.environ:
    bucket_name = os.environ['BucketName']
else:
    bucket_name = 'test'


class S3Bucket:
    def read(self):
        s3Object = s3.Object(bucket_name, "sessions.yaml")
        try:
            return s3Object.get()['Body'].read().decode('utf-8')
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                return ""
            else:
                raise e

    def write(self, string):
        s3Object = s3.Object(bucket_name, "sessions.yaml")
        s3Object.put(Body=string.encode('utf-8'))
