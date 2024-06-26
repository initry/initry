from collections import defaultdict

from pymongo.collection import Collection

from services.main import AppService
from storage import st


class TestsService(AppService):
    def __init__(self):
        super().__init__()
        self.collection: Collection = self.mongo.db["tests"]

    def get_test_by_id(self, test_id):
        return self.mongo.find_one_by_key_value(
            key="uuid", value=test_id, collection_name=self.collection.name
        )

    def get_test_logs_by_id(self, test_id):
        return self.mongo.find_one_by_key_value(
            key="uuid", value=test_id, collection_name="test_logs"
        )

    def get_tests_from_test_run(self, test_run_id):
        db_data = self.mongo.find_many(
            {"testRunUuid": test_run_id}, collection_name=self.collection.name
        )
        tests_from_storage = st.get_tests_linked_to_test_run(test_run_uuid=test_run_id)

        # Create a dictionary to store merged values based on uuid
        merged_dict = defaultdict(dict)

        # Merge dictionaries from the first list
        for d in db_data:
            merged_dict[d["uuid"]].update(d)

        # Merge dictionaries from the second list
        for d in tests_from_storage:
            merged_dict[d["uuid"]].update(d)

        # Convert the defaultdict back to a list of dictionaries
        merged_list = list(merged_dict.values())
        return merged_list

    def get_running_tests_from_test_run(self, test_run_id):
        test = st.get_running_tests_by_test_run_id(test_run_uuid=test_run_id)
        return test

    def get_history_by_test_id(self, test_id, limit=20, sort=("_id", "DESC")):
        test_data = self.get_test_by_id(test_id)
        query = {"nodeid": test_data["nodeid"], "uuid": {"$ne": test_id}}
        db_data = self.mongo.find_many(
            query,
            limit=limit,
            sort=[sort],
            collection_name=self.collection.name,
        )
        return db_data

    def get_test_by_nodeid_and_test_run_uuid(self, nodeid, test_run_uuid):
        return st.get_test_by_nodeid_and_test_run_uuid(nodeid, test_run_uuid)
