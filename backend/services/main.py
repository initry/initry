import threading

from database.mongo import MongoDB


class DBSessionMixin:
    def __init__(self):
        self.mongo = MongoDB()


class AppService(DBSessionMixin):
    def __init__(self):
        super().__init__()
        self.lock = threading.Lock()
