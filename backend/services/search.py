
from pymongo.collection import Collection

from services.main import AppService



class SearchService(AppService):
    def __init__(self):
        super().__init__()
        self.collection: Collection = self.mongo.db["tests"]

    def get_tests_by_name(self, name: str, status: str = None):

        query = {"location": name}

        if status:
            query["status"] = status

        result = self.mongo.find_many_and_count(filter_criteria=query, collection_name=self.collection.name)
        return result
