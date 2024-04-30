from database.mongo import MongoDB
from tasks.tasks import celery


@celery.task
def create_db_data_based_on_xml(test_run_uuid, test_run):
    MongoDB().modify_object(
        find={"uuid": test_run_uuid},
        update={**test_run},
        collection_name="test_runs",
    )


@celery.task
def save_json_and_xml_files(json_data, xml_data, test_run_uuid):
    try:
        MongoDB().insert_object(
            item={"uuid": test_run_uuid, "json": json_data, "xml": xml_data},
            collection_name="test_runs_raw",
        )
    except Exception as e:
        print(e)


@celery.task
def save_failed_logs(failures_for_db):
    MongoDB().save_objects(items=failures_for_db, collection_name="test_logs")


@celery.task
def save_skipped_logs(skipped_for_db):
    MongoDB().save_objects(items=skipped_for_db, collection_name="test_logs")
