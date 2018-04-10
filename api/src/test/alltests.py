import sys
from . import mockboto3
from . import mockbotocore

sys.modules['boto3'] = mockboto3
sys.modules['botocore'] = mockbotocore
from .test_lambdaproxyapi import *
