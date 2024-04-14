from pymongo import MongoClient

from settings import Settings
from tasks.tasks import celery


@celery.task
def write_test_log(test, found_strings):
    settings = Settings()

    client = MongoClient(settings.get("MONGO_URL"))
    db = client[settings.get("DATABASE_NAME")]
    collection = db["test_logs"]

    log_data = {"uuid": test["uuid"]}

    for key in found_strings:
        log_data[key] = test[key]

    collection.insert_one(log_data)
