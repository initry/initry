import aiofiles
import xmltodict
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from starlette import status

from schemas.test_run import TestRun, TestRunsList
from services.test_runs import TestRunsService

test_run_router = APIRouter(prefix="/api/test-runs")
test_run_service = TestRunsService()

CHUNK_SIZE = 1024 * 3200


@test_run_router.get(
    "/latest",
    operation_id="getLatestTestRuns",
    response_model=TestRunsList,
    tags=["Test runs"],
)
def get_latest_test_runs():
    return test_run_service.get_latest_test_runs(10)


@test_run_router.get(
    "/{test_run_id}",
    operation_id="getTestRunById",
    response_model=TestRun,
    tags=["Test runs"],
)
def get_test_run_by_id(test_run_id):
    return test_run_service.get_test_run_by_id(test_run_id)


@test_run_router.post("/xml")
async def upload_xml(
    file: UploadFile = File(...), uuid: str = Form(...), mode: str = Form(...)
):
    try:
        async with aiofiles.tempfile.NamedTemporaryFile("wb", delete=False) as f:
            while chunk := await file.read(CHUNK_SIZE):
                await f.write(chunk)
                await f.seek(0)
        async with aiofiles.open(f.name, "r", encoding="utf8") as f2:
            reader = await f2.read()
            try:
                json_data = xmltodict.parse(reader)
            except Exception as e:
                print(e)
            if mode == "xml_only":
                test_run_service.xml_modify_test_run(json_data, uuid)  # move to celery
                test_run_service.xml_create_tests(json_data, uuid)  # move to celery
                # test_run_service.xml_create_test_logs(json_data)
                test_run_service.raw_data_save(
                    json_data=json_data, xml_data=reader, test_run_uuid=uuid
                )  # move to celery
            if mode == "store":
                test_run = {}
                testsuite = json_data["testsuites"]["testsuite"]
                if testsuite["@name"]:
                    test_run["testSuite"] = testsuite["@name"]
                if testsuite["@hostname"]:
                    test_run["hostName"] = testsuite["@hostname"]
                test_run_service.modify_test_run(test_run, uuid)
                test_run_service.raw_data_save(
                    json_data=json_data, xml_data=reader, test_run_uuid=uuid
                )  # move to celery
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="There was an error uploading the file",
        )
    finally:
        await file.close()

    return json_data
