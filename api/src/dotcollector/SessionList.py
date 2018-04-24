from .PersistantObject import PersistantObject
from typing import List


class SessionList(PersistantObject):
    sessions: List[dict] = []

    def get_by_id(self, session_id):
        for session in self.sessions:
            if session['id'] == session_id:
                return session

    def get_by_code(self, session_code):
        for session in self.sessions:
            if session['accessCode'] == session_code:
                return session
