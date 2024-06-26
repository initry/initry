import aiofiles
import xmltodict
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from starlette import status

from schemas.test_run import TestRun, TestRunsList
from services.test_runs import TestRunsService
from tasks import xml_related

test_run_router = APIRouter(prefix="/api/test-runs")
test_run_service = TestRunsService()

CHUNK_SIZE = 1024 * 1024


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
        count = test_run_service.xml_get_raw_test_run(uuid)
        if count > 0:
            return
        async with aiofiles.tempfile.NamedTemporaryFile("wb", delete=False) as f:
            while chunk := await file.read(CHUNK_SIZE):
                await f.write(chunk)
        async with aiofiles.open(f.name, "r", encoding="utf8") as f2:
            reader = await f2.read()
            try:
                json_data = xmltodict.parse(reader)
            except Exception as e:
                print(e)
            if mode == "xml_only":
                count = test_run_service.xml_get_raw_test_run(uuid)
                if count > 0:
                    return
                test_run_service.xml_modify_test_run(json_data, uuid)
                test_run_service.xml_create_tests(json_data, uuid)
                xml_related.save_json_and_xml_files.delay(
                    json_data=json_data, xml_data=reader, test_run_uuid=uuid
                )  # move to celery
            if mode == "store":
                count = test_run_service.xml_get_raw_test_run(uuid)
                if count > 0:
                    return
                test_run = {}
                testsuite = json_data["testsuites"]["testsuite"]
                if testsuite["@name"]:
                    test_run["testSuite"] = testsuite["@name"]
                if testsuite["@hostname"]:
                    test_run["hostName"] = testsuite["@hostname"]
                test_run_service.modify_test_run(test_run, uuid)
                xml_related.save_json_and_xml_files.delay(
                    json_data=json_data, xml_data=reader, test_run_uuid=uuid
                )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="There was an error uploading the file",
        )
    finally:
        await file.close()

    return json_data
