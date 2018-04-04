from dotcollectorlambdaapi import DotCollectorLambdaApi


api = DotCollectorLambdaApi()

def get_sessions(event, context):
    return api.get_sessions(event, context)

def post_sessions(event, context):
    return api.post_sessions(event, context)

def get_session_by_id(event, context):
    return api.get_session_by_id(event, context)

def get_session_by_code(event, context):
    return api.get_session_by_code(event, context)
