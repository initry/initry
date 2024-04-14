from pymongo import MongoClient

from settings import Settings
from tasks.tasks import celery


@celery.task
def write_test_log(test):
    settings = Settings()

    client = MongoClient(settings.get("MONGO_URL"))
    db = client[settings.get("DATABASE_NAME")]
    collection = db["test_logs"]

    collection.insert_one(
        {
            "uuid": test["uuid"],
            "log": test["log"],
            "stdout": test["stdout"],
            "stderr": test["stderr"],
        }
    )
