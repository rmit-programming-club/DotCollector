import errors
import yaml

class LambdaProxyWrapper:
    def __init__(self, function):
        self.function = function

    def load_body(self, event):
        if self.want_yaml(event):
            try:
                return yaml.load(event['body'])
            except yaml.YAMLError e:
                raise errors.UserError('CouldNotParseBody', e)
        else:
            try:
                return json.loads(event['body'])
            except json.JSONError e: # Not sure about name
                raise errors.UserError('CouldNotParseBody', e)



    def wants_yaml(self, event):
        has_headers = 'headers' in event
        if has_headers:
            has_content_type = 'Content-Type' in event['headers']
            if has_content_type:
                return event['headers']['Content-Type'] == 'application/yaml'
        return False

    def is_get(self, event)
        return event['httpMethod'] == 'GET'
    
    def get_body(self, event):
        if self.is_get(event):
            return = self.function()
        else:
            request = yaml.load(event['body'])

            return = self.function(request)

    def error_to_body(self, error):
        return {
            "name": error[0],
            "description": error[1]
        }

    def __call__(self, event, context):
        code = '200'
        body = ''
        try:
            body = self.get_body(event)
            if !body:
                code = '204'

        except errors.NotFoundError e:
            code = '404'
            body = error_to_body(e)
        except errors.UserError e:
            code = '400'
            body = error_to_body(e)

        response = {}
        response['statusCode'] = code
        response['headers'] = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application': 'application/yaml' if self.wants_yaml(event) else 'application/json'
        }
        if body:
            response['body'] = body
        return response
        

