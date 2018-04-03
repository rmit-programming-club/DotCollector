import yaml
import json
import boto3
import botocore
import os
import hashlib
import time
import random

s3 = boto3.resource('s3')

def get_sessions(event, context):
    bucketName = os.environ["BucketName"]
    sessionsFile = s3.Object(bucketName, "sessions.yaml")
    try:
        content = sessionsFile.get()['Body'].read().decode('utf-8')
        if event["headers"] and 'Content-Type' in event["headers"] and event["headers"]["Content-Type"] == "application/yaml":
            return {
                "statusCode": "200",
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": content
            }      
        else:
            jsonContent = json.dumps(yaml.load(content))
            return {
                "statusCode": "200",
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": jsonContent
            }
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return {
                "statusCode": "200",
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": "[]"
            }
        else:
            raise e


def get_unique_identifier(session):
    hasher = hashlib.md5()
    hasher.update(session["name"].encode("utf-8"))
    hasher.update(str(time.time()).encode("utf-8"))
    return hasher.hexdigest()

def generate_session_details(sessionCreationRequest):
    session = {}
    session["name"] = sessionCreationRequest["name"]
    session["id"] = get_unique_identifier(sessionCreationRequest)
    session["active"] = True
    session["timestamp"] = int(time.time())
    session["accessCode"] = random.randrange(1000000)
    return session


def post_sessions(event, context):
    bucketName = os.environ["BucketName"]
    sessionsFile = s3.Object(bucketName, "sessions.yaml")
    newSession = {}
    try:
        newSession = generate_session_details(yaml.load(event["body"]))
    except yaml.YAMLError as e:
        # Failed to parse given content
        body = {
            "name": "ParseError",
            "description": "%s" % e 
        }

        return {
            "statusCode": "400",
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(body)
        }
    collatedSessions = []
    try:
        existingSessionsYaml = sessionsFile.get()['Body'].read().decode('utf-8')
        collatedSessions = yaml.load(existingSessionsYaml)
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] != "NoSuchKey":
            raise e

    collatedSessions.append(newSession)
    encodedSessions =  yaml.dump(collatedSessions).encode("utf-8")
    sessionsFile.put(Body= encodedSessions)
    return {
            "statusCode": '200',
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(newSession)
    }
