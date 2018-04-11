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

        if body is not None:
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
        else:
            response['statusCode']: str = '204'
            response['headers'] = {
                'Access-Control-Allow-Origin': '*'
            }

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
            if event['body']:
                request_body = yaml.load(event['body'])
                if request_body and 'name' in request_body:
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
            is_yaml = self.wants_yaml(event)

            content_type = 'YAML' if is_yaml else 'JSON'

            return self.make_response(event, code='400', body={
                'name': 'Parse Error',
                'description': 'Could not parse body as ' + content_type
            })

    def make_no_such_session_with(self, event, prop, value):
        description = 'No such session with {} \'{}\''.format(prop, value)
        return self.make_response(event, body={
            'name': 'No Such Session',
            'description': description
        }, code='404')

    def delete_session(self, event, context):
        session_id = event['pathParameters']['id']
        session = self.dot_collector.get_session_by_id(session_id)
        if session:
            self.dot_collector.delete_session(session_id)
            return self.make_response(event)
        else:
            return self.make_no_such_session_with(event, 'id', session_id)

    def get_session_by_id(self, event, context):

        session_id = event['pathParameters']['id']
        session = self.dot_collector.get_session_by_id(session_id)
        if session:
            return self.make_response(event, body=session)
        else:
            return self.make_no_such_session_with(event, 'id', session_id)

    def get_session_by_code(self, event, context):
        parameters = event['queryStringParameters']
        if parameters and 'code' in parameters:
            code = event['queryStringParameters']['code']

            session = self.dot_collector.get_session_by_access_code(code)
            if session:
                return self.make_response(event, body=session)
            else:
                return self.make_no_such_session_with(event, 'code', code)
        else:
            return self.make_response(event, body={
                'name': 'Missing parameter',
                'description': 'This command requires the code parameter'
            }, code='400')

    def get_feedback(self, event, context) -> dict:
        session_id = event['pathParameters']['id']

        feedback: List[dict] = self.dot_collector.get_feedback(session_id)

        if feedback is None:
            return self.make_no_such_session_with(event, 'id', session_id)
        else:
            return self.make_response(event, body=feedback)

    def post_feedback(self, event: dict, context: dict) -> dict:
        session_id = event['pathParameters']['id']
        try:
            if event['body']:
                request_body = yaml.load(event['body'])
                if 'question' in request_body and 'value' in request_body:
                    self.dot_collector.add_feedback(session_id, request_body)
                    return self.make_response(event)
                else:
                    return self.make_response(event, body={
                        "name": "Missing Field",
                        "description": "Requires question and value fields"
                    }, code='400')
            else:
                return self.make_response(event, body={
                    'name': 'Missing Body',
                    'description': 'This operation requires a body'
                }, code='400')

        except yaml.YAMLError as e:
            return self.make_response(event, body=e, code='400')
