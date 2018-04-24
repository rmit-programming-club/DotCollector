""" Entry point for application logic """

import hashlib
import time
import random
from typing import List

from .SessionList import SessionList


class DotCollector:
    def __init__(self, persistence):
        self.session_list = SessionList(persistence)

    def get_sessions(self) -> List[dict]:
        return self.session_list.sessions

    def add_session(self, session_name: str) -> dict:
        session_details: dict = self.generate_session_details(session_name)
        self.session_list.sessions.append(session_details)
        self.session_list.save()

        return session_details

    def delete_session(self, session_id: str) -> None:
        session = self.get_session_by_id(session_id)
        self.session_list.sessions.remove(session)
        self.session_list.save()

    def get_session_by_id(self, session_id: str) -> dict:

        return self.session_list.get_by_id(session_id)

    def get_session_by_access_code(self, session_access_code: str) -> dict:

        return self.session_list.get_by_code(session_access_code)

    @staticmethod
    def get_unique_identifier(session_name: str) -> str:
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
        code = random.randrange(1000000)
        session["accessCode"] = "{0:06d}".format(code)
        session['feedback'] = []
        return session

    def add_feedback(self, session_id: str, feedback: dict) -> None:
        session: dict = self.session_list.get_by_id(session_id)
        feedback['timestamp'] = int(time.time())
        session['feedback'].append(feedback)
        self.session_list.save()

    def patch_session(self, session_id: str, patch: dict) -> None:
        session: dict = self.get_session_by_id(session_id)
        for change in patch.items():
            if change[0] in session:
                session[change[0]] = change[1]
        self.session_list.save()
