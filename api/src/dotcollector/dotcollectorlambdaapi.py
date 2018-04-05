from . import yaml
import json
from .s3bucket import S3Bucket
from .dotcollector import DotCollector
from typing import List


class DotCollectorLambdaApi:

    def __init__(self):
        self.persistance = S3Bucket()
        self.dot_collector = DotCollector(self.persistance)

    def get_sessions(self, event, context) -> List[dict]:
        sessions: List[dict] = self.dot_collector.get_sessions()

        return self.make_response(event, body=sessions)

    def make_response(self, event: dict,
                      code: str='200', body: dict=None) -> dict:

        response_is_yaml = self.wants_yaml(event)

        response = {}

        if response_is_yaml:
            content_type = 'application/yaml'
            response['body'] = yaml.dump(body)
        else:
            content_type = 'application/json'
            response['body'] = json.dumps(body)

        response['statusCode'] = code
        response['headers'] = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': content_type
        }

        if body is not None:
            code: str = '204'
        return response

    def wants_yaml(self, event):
        has_headers = event['headers']
        if has_headers:
            has_content_type = 'Content-Type' in event['headers']
            if has_content_type:
                return event['headers']['Content-Type'] == 'application/yaml'
        return False

    def post_session(self, event, context):
        try:
            if 'body' in event:
                request_body = yaml.load(event['body'])
                if 'name' in request_body:
                    name = request_body['name']
                    new_session = self.dot_collector.add_session(name)

                    return self.make_response(event, body=new_session)
                else:
                    return self.make_response(event, code='400', body={
                        "name": "Missing Field",
                        "description": "Missing name field"
                        })
            else:
                return self.make_response(event, code='400', body={
                    'name': 'Missing Body',
                    'description': 'This operation requires a body'
                })
        except yaml.YAMLError as e:
            return self.make_response(event, code='400', body=e)

    def get_session_by_id(self, event, context):

        session_id = event['pathParameters']['id']
        session = self.dot_collector.get_session_by_id(session_id)
        if session:
            return self.make_response(event, body=session)
        else:
            return self.make_response(event, body={
                "name": "NoSuchSession",
                "description": "No such session with id " + session_id
            }, code='404')

    def get_session_by_code(self, event, context):
        session_code = event['queryStringParameters']['code']

        session = self.dot_collector.get_session_by_access_code(session_code)
        if session:
            return self.make_response(event, body=session)
        else:
            return self.make_response(event, body={
                "name": "NoSuchSession",
                "description": "No such session with code " + session_code
            }, code='404')
