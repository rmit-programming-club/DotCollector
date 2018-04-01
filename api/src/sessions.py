import yaml
import json
import boto3
import botocore
import os

s3 = boto3.resource('s3')

def get_sessions(event, context):
    bucketName = os.environ["BucketName"]
    bucket = s3.Bucket(bucketName)
    sessionsFile = s3.Object(bucketName, "sessions.yaml")
    try:
        content = sessionsFile.get()['Body'].read().decode('utf-8')
        if event.headers["content-type"] == "application/json":
            jsonContent = json.dumps(yaml.load(content))
            return {
                "statusCode": "200",
                "body": jsonContent
            }
        else:
            return {
                "statusCode": "200",
                "body": content
            }      
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return {
                "statusCode": "200",
                "body": "[]"
            }
        else:
            raise e
