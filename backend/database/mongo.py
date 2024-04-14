from typing import Any

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.database import Database
from pymongo.errors import PyMongoError

from settings import Settings


def handle_mongodb_exception(exception):
    """
    Helper function to handle MongoDB exceptions.
    """
    print(f"MongoDB: PyMongoError occurred: {exception}")


class MongoDB:
    _instance = None
    client: MongoClient = {}
    db: Database = {}

    def __new__(cls):
        if cls._instance is None:
            settings = Settings()
            cls._instance = super(MongoDB, cls).__new__(cls)
            cls.client = MongoClient(settings.get("MONGO_URL"))
            cls.db = cls.client[settings.get("DATABASE_NAME")]
        return cls._instance

    def insert_object(self, item, collection_name) -> Any:
        """
        Insert an object in MongoDB
        :param item: {}
        :param collection_name: str
        :return: None | Any
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(item, dict):
                return None
            result = collection.insert_one(item)
            return result.inserted_id
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def modify_object(self, find, update, collection_name):
        """
        :param find: {"key": "value"}
        :param update: {"key": "value"}
        :param collection_name: str
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(find, dict) or not isinstance(update, dict):
                raise ValueError(
                    "Both 'find' and 'update' parameters must be dictionaries"
                )
            result = collection.update_one(find, {"$set": update})
            if result.matched_count == 0:
                raise ValueError("MongoDB: No object found matching the given filter")
            if result.modified_count == 0:
                raise ValueError("MongoDB: No modifications were made")
            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def save_objects(self, items, collection_name):
        """
        Save a list of objects into a collection
        :param items: list of objects
        :param collection_name: str
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(items, (list, tuple)):
                raise ValueError("MongoDB: Items must be a list or tuple")
            for item in items:
                if not isinstance(item, dict):
                    raise ValueError("MongoDB: Each item must be a dictionary")
            result = collection.insert_many(items)
            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find(self, limit=None, collection_name=None):
        """
        Get all objects
        :param collection_name: str
        :param limit: int
        :return:
        """
        try:
            collection = self.db[collection_name]
            if limit is None:
                result = collection.find()
            else:
                result = collection.find().limit(limit)
            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find_many(self, filter_criteria, collection_name, limit=0, skip=0, sort=None):
        """
        Find all objects matching the criteria
        :param filter_criteria: {"key": "value"}
        :param collection_name: str
        :param limit: int
        :param skip: int
        :param sort: tuple
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(filter_criteria, dict):
                raise ValueError("MongoDB: Filter criteria must be a dictionary")

            if sort:
                sort_criteria = [(field, DESCENDING if order == "DESC" else ASCENDING) for field, order in sort]
            else:
                sort_criteria = None

            if sort_criteria:
                result = collection.find(filter_criteria, limit=limit, skip=skip).sort(sort_criteria)
            else:
                result = collection.find(filter_criteria, limit=limit, skip=skip)

            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find_many_and_count(self, filter_criteria, collection_name, limit=0, skip=0, sort=None):
        """
        Find all objects matching the criteria
        :param filter_criteria: {"key": "value"}
        :param collection_name: str
        :param limit: int
        :param skip: int
        :param sort: tuple
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(filter_criteria, dict):
                raise ValueError("MongoDB: Filter criteria must be a dictionary")

            pipeline = [{"$match": filter_criteria}]

            if sort:
                sort_criteria = {
                    "$sort": {field: DESCENDING if order == "DESC" else ASCENDING for field, order in sort}}
                pipeline.append(sort_criteria)

            skip_opt = {"$skip": skip} if skip else None
            limit_opt = {"$limit": limit} if limit else None

            facet_result = []

            if skip_opt:
                pipeline.append({"$skip": skip})
                facet_result.append(skip_opt)

            if limit_opt:
                pipeline.append({"$limit": limit})
                facet_result.append(limit_opt)

            pipeline.append({
                "$facet": {
                    "result": facet_result,  # Pagination in result
                    "totalCount": [{"$count": "total"}]  # Count of all documents matching the filter
                }
            })

            result = list(collection.aggregate(pipeline))

            if result:
                count = result[0]["totalCount"][0]["total"] if result[0]["totalCount"] else 0
                actual_result = result[0]["result"]
            else:
                count = 0
                actual_result = []

            return actual_result, count

        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find_one_sorted(self, sort_criteria, collection_name):
        """
        Find one object matching the criteria
        :param sort_criteria: Example: [("_id", DESCENDING)]
        :param collection_name: str
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(sort_criteria, list):
                raise ValueError("MongoDB: Sort criteria must be a list of tuples")
            for criterion in sort_criteria:
                if not isinstance(criterion, tuple) or len(criterion) != 2:
                    raise ValueError(
                        "MongoDB: Each sort criterion must be a tuple of field and direction"
                    )
            result = collection.find_one({}, sort=sort_criteria)
            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find_sorted_limited(self, sort_criteria, limit, collection_name):
        """
        :param sort_criteria: Example: [("_id", DESCENDING)]
        :param limit: int
        :param collection_name: str
        :return:
        """
        try:
            collection = self.db[collection_name]
            if not isinstance(sort_criteria, list):
                raise ValueError("MongoDB: Sort criteria must be a list of tuples")
            for criterion in sort_criteria:
                if not isinstance(criterion, tuple) or len(criterion) != 2:
                    raise ValueError(
                        "MongoDB: Each sort criterion must be a tuple of field and direction"
                    )
            result = collection.find().sort(sort_criteria).limit(limit)
            return list(result)
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None

    def find_one_by_key_value(self, key, value, collection_name):
        """
        Find one object matching the criteria
        :param key: str
        :param value: ...
        :param collection_name:
        :return:
        """
        try:
            collection = self.db[collection_name]
            result = collection.find_one({key: value})
            return result
        except (PyMongoError, ValueError) as e:
            handle_mongodb_exception(e)
            return None


def db():
    return MongoDB().db
