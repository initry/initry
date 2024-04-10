import time

from pydantic import ValidationError
from pymongo import MongoClient, UpdateOne

from schemas.test import Test
from settings import Settings
from tasks.tasks import celery


@celery.task
def update_tests_by_id(updated_data, collection):
    settings = Settings()

    client = MongoClient(settings.get("MONGO_URL"))
    db = client[settings.get("DATABASE_NAME")]
    collection = db[collection]

    # Initialize variables for batch processing
    batch_size = min(
        100, len(updated_data)
    )  # Start with a batch size of up to 100 updates
    start_time = time.time()
    inserts_count = 0

    # Check schemas
    try:
        [Test(**item) for item in updated_data[:batch_size]]
    except ValidationError as e:
        print(e)

    # Prepare bulk write operations
    bulk_operations = [
        UpdateOne(
            {"uuid": item["uuid"]},
            {
                "$set": {
                    "status": item["status"],
                    "startedAt": item["startedAt"],
                    "stoppedAt": item["stoppedAt"],
                }
            },
        )
        for item in updated_data[:batch_size]
    ]

    # Perform bulk write operations
    collection.bulk_write(bulk_operations)
    inserts_count += batch_size

    # Check elapsed time
    elapsed_time = time.time() - start_time

    # If elapsed time is less than 1 second and there are remaining updates, adjust batch size
    while elapsed_time < 1 and inserts_count < len(updated_data):
        remaining_updates = updated_data[inserts_count:]
        batch_size = min(100, len(remaining_updates))

        # Prepare bulk write operations for the next batch
        bulk_operations = [
            UpdateOne(
                {"uuid": item["uuid"]},
                {
                    "$set": {
                        "status": item["status"],
                        "startedAt": item["startedAt"],
                        "stoppedAt": item["stoppedAt"],
                    }
                },
            )
            for item in remaining_updates[:batch_size]
        ]

        # Perform bulk write operations for the next batch
        collection.bulk_write(bulk_operations)
        inserts_count += batch_size

        # Check elapsed time
        elapsed_time = time.time() - start_time
