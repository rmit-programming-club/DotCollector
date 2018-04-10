
def resource(name):
    return S3Resource()


class S3Resource:
    def Object(self, bucket_name, key):
        return S3Object()


class S3Object:
    def get(self):
        return {
            "Body": mockFile
        }
        pass

    def put(self, Body=b''):
        mockFile.text = Body


class MockFile:
    def __init__(self):
        self.text = b''

    def read(self):
        return self.text


mockFile = MockFile()
