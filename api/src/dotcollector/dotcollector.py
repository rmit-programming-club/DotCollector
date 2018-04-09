""" Entry point for application logic """

import hashlib
import time
import random
from typing import List

from .persistentobjectlist import PersistentObjectList


class DotCollector:
    def __init__(self, persistence):
        self.session_list = PersistentObjectList(persistence)

    def get_sessions(self) -> List[dict]:
        return self.session_list.to_list()

    def add_session(self, session_name: str) -> dict:
        session_details: dict = self.generate_session_details(session_name)
        self.session_list.add(session_details)

        return session_details

    def delete_session(self, session_id: str) -> None:
        session = self.get_session_by_id(session_id)
        self.session_list.remove(session)

    def get_session_by_id(self, session_id: str) -> dict:
        def has_correct_id(session: dict) -> bool:
            return session['id'] == session_id

        return self.session_list.find(has_correct_id)

    def get_session_by_access_code(self, session_access_code: str) -> dict:
        def has_correct_access_code(session: dict) -> bool:
            return str(session['accessCode']) == session_access_code

        return self.session_list.find(has_correct_access_code)

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
        session["accessCode"] = random.randrange(1000000)
        session['feedback'] = []
        return session

    def add_feedback(self, session_id: str, feedback: dict) -> None:
        session: dict = self.get_session_by_id(session_id)
        self.session_list.remove(session)
        feedback['timestamp'] = int(time.time())
        session['feedback'].append(feedback)
        self.session_list.add(session)
