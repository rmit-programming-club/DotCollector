import unittest
import dotcollector.yaml as yaml
from dotcollector.dotcollectorlambdaapi import DotCollectorLambdaApi
import json
from typing import List


class LambdaProxyApiTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.api = DotCollectorLambdaApi()

    def assert_valid_headers(self, response: dict, yaml_wanted: bool=False):
        self.assertIn('headers', response)

        self.assert_cors(response)
        self.assert_content_type(response, yaml_wanted)

    def assert_cors(self, response: dict):
        headers = response['headers']
        self.assertIn('Access-Control-Allow-Origin', headers)

        self.assertEqual(headers['Access-Control-Allow-Origin'], '*')

    def assert_content_type(self, response: dict, yaml_wanted: bool):
        headers: dict = response['headers']
        self.assertIn('Content-Type', headers)

        if yaml_wanted:
            desired_content_type = 'application/yaml'
        else:
            desired_content_type = 'application/json'

        self.assertEqual(headers['Content-Type'], desired_content_type)

    def get_sessions(self) ->List[dict]:
        request = {
            'headers': None
        }

        api = DotCollectorLambdaApi()
        response = api.get_sessions(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('200', response['statusCode'])
        self.assertIn('body', response)
        return yaml.load(response['body'])

    def test_get_no_sessions(self):
        sessions = self.get_sessions()
        self.assertEqual(sessions, [])

    def test_post_session_no_body(self):
        request = {
            'headers': {
                'Content-Type': 'application/yaml'
            },
            'body': None
        }

        response = self.api.post_session(request, {})

        self.assert_valid_headers(response, yaml_wanted=True)
        self.assertIn('body', response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual(yaml.load(response['body']), {
            'name': 'Missing Body',
            'description': 'This operation requires a body'
        })

        # Check if there are any sessions after that
        self.test_get_no_sessions()

    def delete_all_sessions(self) -> None:
        sessions: List[dict] = self.get_sessions()
        for session in sessions:
            request = {
                'headers': None,
                'pathParameters': {
                    'id': session['id']
                }
            }
            self.api.delete_session(request, {})

        self.test_get_no_sessions()

    def test_post_session_no_name(self) -> None:
        request: dict = {
            'headers': None,
            'body': '{}'
        }

        response: dict = self.api.post_session(request, {})

        self.assert_valid_headers(response)
        self.assertEqual(response['statusCode'], '400')
        self.assertIn('body', response)
        self.assertEqual(yaml.load(response['body']), {
            "name": "Missing Field",
            "description": "Missing name field"
        })

        self.test_get_no_sessions()

    def assert_is_valid_session(self, session: dict) -> None:
        self.assertIn('name', session)
        self.assertIn('id', session)
        self.assertIn('accessCode', session)
        self.assertIn('timestamp', session)
        self.assertIn('feedback', session)

    def post_valid_session(self) -> dict:
        request: dict = {
            'headers': None,
            'body': json.dumps({
                'name': 'testName'
            })
        }

        response: dict = self.api.post_session(request, {})

        self.assert_valid_headers(response)
        self.assertEqual(response['statusCode'], '200')
        self.assertIn('body', response)
        body: dict = yaml.load(response['body'])
        self.assert_is_valid_session(body)
        return body

    def test_post_valid_session(self) -> None:
        self.post_valid_session()
        self.delete_all_sessions()

    def test_post_valid_feedback(self) -> None:
        session = self.post_valid_session()
        session_id = session['id']

        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': session_id
            },
            'body': json.dumps({
                'question': 'What is your father\'s name?',
                'value': 'Tom'
            })
        }

        response: dict = self.api.post_feedback(request, {})

        self.assertEqual(response['statusCode'], '204')
        self.assertNotIn('body', response)

        get_session_request: dict = {
            'headers': None
        }

        sessions = self.api.get_sessions(get_session_request, {})
        body = yaml.load(sessions['body'])

        self.assertIn('feedback', body[0])

        all_feedback = body[0]['feedback']
        self.assertEqual(1, len(all_feedback))

        feedback = all_feedback[0]
        self.assertEqual('What is your father\'s name?', feedback['question'])
        self.assertEqual('Tom', feedback['value'])
        self.assertIn('timestamp', feedback)

        self.delete_all_sessions()

    def test_get_session_by_id(self):
        session = self.post_valid_session()

        session_id = session['id']
        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': session_id
            }
        }
        response: dict = self.api.get_session_by_id(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('200', response['statusCode'])
        self.assertEqual(session, yaml.load(response['body']))

        self.delete_all_sessions()

    def test_get_session_by_access_code(self):
        session = self.post_valid_session()

        access_code = session['accessCode']
        request: dict = {
            'headers': None,
            'queryStringParameters': {
                'code': str(access_code)
            }
        }

        response: dict = self.api.get_session_by_code(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('200', response['statusCode'])
        self.assertEqual(session, yaml.load(response['body']))

        self.delete_all_sessions()

    def test_get_session_by_invalid_id(self):
        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': 'notanid'
            }
        }
        response: dict = self.api.get_session_by_id(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('404', response['statusCode'])
        self.assertEqual({
            'name': 'No Such Session',
            'description': 'No such session with id \'notanid\''
        }, yaml.load(response['body']))

    def test_get_session_by_invalid_code(self):
        request: dict = {
            'headers': None,
            'queryStringParameters': {
                'code': 'notacode'
            }
        }

        response: dict = self.api.get_session_by_code(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('404', response['statusCode'])
        self.assertEqual({
            'name': 'No Such Session',
            'description': 'No such session with code \'notacode\''
        }, yaml.load(response['body']))

    def test_get_session_with_no_code(self):
        request: dict = {
            'headers': None,
            'queryStringParameters': None
        }

        response: dict = self.api.get_session_by_code(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing parameter',
            'description': 'This command requires the code parameter'
        }, yaml.load(response['body']))

    def test_get_session_with_wrong_parameter(self):
        request: dict = {
            'headers': None,
            'queryStringParameters': {
                'cde': 'validcode'
            }
        }

        response: dict = self.api.get_session_by_code(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing parameter',
            'description': 'This command requires the code parameter'
        }, yaml.load(response['body']))

    # Post session with invalid body, in different forms
    def test_post_session_not_json(self):
        request: dict = {
            'headers': None,
            'body': '{{whatever: thi}s is; it"s n)t:js{}n'
        }

        response: dict = self.api.post_session(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Parse Error',
            'description': 'Could not parse body as JSON'
        }, yaml.load(response['body']))

        self.test_get_no_sessions()

    def test_post_session_without_name_field(self):
        request: dict = {
            'headers': None,
            'body': '{}'
        }

        response: dict = self.api.post_session(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing Field',
            'description': 'Missing name field'
        }, yaml.load(response['body']))

        self.test_get_no_sessions()

    def test_post_feedback_with_invalid_id(self):
        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': 'notanid'
            },
            'body': json.dumps({
                    'question': 'Why did the chicken cross the road?',
                    'value': 'To find a better joke'
                })
        }

        response: dict = self.api.get_session_by_id(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('404', response['statusCode'])
        self.assertEqual({
            'name': 'No Such Session',
            'description': 'No such session with id \'notanid\''
        }, yaml.load(response['body']))

    def test_post_feedback_with_no_body(self) -> None:
        session = self.post_valid_session()
        session_id = session['id']

        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': session_id
            },
            'body': None
        }

        response = self.api.post_feedback(request, {})
        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing Body',
            'description': 'This operation requires a body'
        }, yaml.load(response['body']))

        self.delete_all_sessions()

    def test_post_feedback_with_empty_body(self) -> None:
        session = self.post_valid_session()
        session_id = session['id']

        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': session_id
            },
            'body': '{}'
        }

        response: dict = self.api.post_feedback(request, {})
        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing Field',
            'description': 'Requires question and value fields'
        }, yaml.load(response['body']))

        self.delete_all_sessions()

    def test_post_feedback_missing_value(self) -> None:
        session = self.post_valid_session()
        session_id = session['id']

        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': session_id
            },
            'body': json.dumps({
                'question': 'What do the rich want and the poor have?'
            })
        }

        response: dict = self.api.post_feedback(request, {})
        self.assert_valid_headers(response)
        self.assertEqual('400', response['statusCode'])
        self.assertEqual({
            'name': 'Missing Field',
            'description': 'Requires question and value fields'
        }, yaml.load(response['body']))

        self.delete_all_sessions()

    def test_delete_invalid_session(self) -> None:
        request: dict = {
            'headers': None,
            'pathParameters': {
                'id': 'nosuchid'
            }
        }

        response: dict = self.api.delete_session(request, {})
        self.assert_valid_headers(response)
        self.assertEqual('404', response['statusCode'])
        self.assertEqual({
            'name': 'No Such Session',
            'description': 'No such session with id \'nosuchid\''
        }, yaml.load(response['body']))
