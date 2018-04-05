import unittest
import dotcollector.yaml as yaml
from dotcollector.dotcollectorlambdaapi import DotCollectorLambdaApi


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

    def test_get_no_sessions(self):
        request = {
            'headers': None
        }

        response = self.api.get_sessions(request, {})

        self.assert_valid_headers(response)
        self.assertEqual('200', response['statusCode'])
        self.assertIn('body', response)
        self.assertEqual(response['body'], '[]')

    def test_post_session_no_body(self):
        request = {
            'headers': {
                'Content-Type': 'application/yaml'
            }
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
