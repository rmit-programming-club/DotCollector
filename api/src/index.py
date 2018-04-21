""" Entry point for API gateway calls """

from dotcollector.dotcollectorlambdaapi import DotCollectorLambdaApi


def get_sessions(event, context):
    """ entry for GET /sessions call """
    api = DotCollectorLambdaApi()
    return api.get_sessions(event, context)


def post_sessions(event, context):
    """ entry for POST /sessions call """
    api = DotCollectorLambdaApi()
    return api.post_session(event, context)


def get_session_by_id(event, context):
    """ entry for GET /session/{id} call """
    api = DotCollectorLambdaApi()
    return api.get_session_by_id(event, context)


def get_session_by_code(event, context):
    """ entry for GET /sessionByAccessCode call """
    api = DotCollectorLambdaApi()
    return api.get_session_by_code(event, context)


def get_feedback(event, context):
    api = DotCollectorLambdaApi()
    return api.get_feedback(event, context)


def post_feedback(event, context):
    api = DotCollectorLambdaApi()
    return api.post_feedback(event, context)


def delete_session(event, context):
    api = DotCollectorLambdaApi()
    return api.delete_session(event, context)


def patch_session(event, context):
    api = DotCollectorLambdaApi()
    return api.patch_session(event, context)
