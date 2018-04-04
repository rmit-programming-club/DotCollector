import yaml
import json
from s3bucket import S3Bucket
from dotcollector import DotCollector



class DotCollectorLambdaApi:

    def __init__(self):
        self.persistance = S3Bucket()
        self.dot_collector = DotCollector(self.persistance)

    def get_sessions(self, event, context):
        sessions = self.dot_collector.get_sessions()
        
        return self.make_response(event, body=sessions)

    def make_response(self,event, code='200',body=None):
        # Make the code 204 if no body
        if not body:
            code = '204'

        response_is_yaml = self.wants_yaml(event)

        response = {}
        response['statusCode'] = code
        response['headers'] = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/yaml' if response_is_yaml else 'application/json'
        }
        
        if body:
            response['body'] = yaml.dump(body) if response_is_yaml else json.dumps(body)
        return response


    def wants_yaml(self, event):
        has_headers = event['headers']
        if has_headers:
            has_content_type = 'Content-Type' in event['headers']
            if has_content_type:
                return event['headers']['Content-Type'] == 'application/yaml'
        return False

    def post_sessions(self, event, context):
        try:
            request_body = yaml.load(event['body'])
            if 'name' in request_body:
                name = request_body['name']
                new_session = self.dot_collector.add_session(name)

                return self.make_response( event, body=new_session)
            else:
                return self.make_response(event, code='400', body={
                    "title": "MissingField",
                    "error": "Missing name fild"
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
                "name":"NoSuchSession",
                "description":"No such session with id " + session_id
            }, code= '404')

    def get_session_by_code(self, event, context):
        session_code = event['queryStringParameters']['code']

        session = self.dot_collector.get_session_by_access_code(session_code)
        if session:
            return self.make_response(event, body=session)
        else:
            return self.make_response(event, body={
                "name":"NoSuchSession",
                "description":"No such session with code " + session_code
            }, code= '404')

