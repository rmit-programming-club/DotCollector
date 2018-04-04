import hashlib
import time
import random

from persistantobjectlist import PersistantObjectList

class DotCollector:
    def __init__(self, persistance):
        self.session_list = PersistantObjectList(persistance)

    def get_sessions(self):
        return self.session_list.to_list()

    def add_session(self, session_name):
        session_details = self.generate_session_details(session_name)
        self.session_list.add(session_details)

        return session_details

    def get_session_by_id(self, session_id):
        return self.session_list.find(lambda session: session['id'] == session_id)

    def get_session_by_access_code(self, session_access_code):
        return self.session_list.find(lambda session: str(session['accessCode']) == session_access_code)

    def get_unique_identifier(self, session_name):
        hasher = hashlib.md5()
        hasher.update(session_name.encode("utf-8"))
        hasher.update(str(time.time()).encode("utf-8"))
        return hasher.hexdigest()

    def generate_session_details(self, session_name):
        session = {}
        session["name"] = session_name
        session["id"] = self.get_unique_identifier(session_name)
        session["active"] = True
        session["timestamp"] = int(time.time())
        session["accessCode"] = random.randrange(1000000)
        return session



    


