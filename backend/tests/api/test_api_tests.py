from pytest_mock import MockerFixture

from tests.main import client


def test_get_test_by_id(mocker: MockerFixture):
    mocker.patch("services.tests.TestsService.get_test_by_id", return_value=test_data)
    response = client.get("/api/tests/123")
    assert response.status_code == 200
    assert response.json() == test_data


def test_get_test_by_id_empty(mocker: MockerFixture):
    mocker.patch("services.tests.TestsService.get_test_by_id", return_value=[])
    response = client.get("/api/tests/123")
    assert response.status_code == 200
    assert response.json() == []


def test_get_tests_from_test_run(mocker: MockerFixture):
    mocker.patch(
        "services.tests.TestsService.get_tests_from_test_run", return_value=test_data2
    )
    response = client.get("/api/tests/?test_run=123")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == test_data2[0]
    assert response.json()[1] == test_data2[1]


def test_get_tests_from_test_run_empty(mocker: MockerFixture):
    mocker.patch("services.tests.TestsService.get_tests_from_test_run", return_value=[])
    response = client.get("/api/tests/?test_run=123")
    assert response.status_code == 200
    assert response.json() == []


def test_get_history_by_test_id(mocker: MockerFixture):
    mocker.patch(
        "services.tests.TestsService.get_history_by_test_id", return_value=test_data3
    )
    response = client.get("/api/tests/123/history")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == test_data3[0]
    assert response.json()[1] == test_data3[1]


def test_get_history_by_test_id_empty(mocker: MockerFixture):
    mocker.patch("services.tests.TestsService.get_history_by_test_id", return_value=[])
    response = client.get("/api/tests/123/history")
    assert response.status_code == 200
    assert response.json() == []


test_data = {
    "uuid": "b63dde90-2df6-4ae6-8ac3-8c8d396d3969",
    "location": "test_0",
    "nodeid": "tests/tests/test_0.py::test_0",
    "testRunUuid": "a88c5996-ee6d-4c1c-a848-f30ad93ef548",
    "description": None,
    "startedAt": "2024-04-11T15:48:37Z",
    "stoppedAt": "2024-04-11T15:48:37Z",
    "status": "PASSED",
}

test_data2 = [
    {
        "uuid": "b63dde90-2df6-4ae6-8ac3-8c8d396d3969",
        "location": "test_0",
        "nodeid": "tests/tests/test_0.py::test_0",
        "testRunUuid": "a88c5996-ee6d-4c1c-a848-f30ad93ef548",
        "description": None,
        "startedAt": "2024-04-11T15:48:37Z",
        "stoppedAt": "2024-04-11T15:48:37Z",
        "status": "PASSED",
    },
    {
        "uuid": "d57c3c53-8495-460a-a3e3-fffecd7ba319",
        "location": "test_1",
        "nodeid": "tests/tests/test_1.py::test_1",
        "testRunUuid": "a88c5996-ee6d-4c1c-a848-f30ad93ef548",
        "description": None,
        "startedAt": "2024-04-11T15:48:37Z",
        "stoppedAt": "2024-04-11T15:48:37Z",
        "status": "PASSED",
    },
]

test_data3 = [
    {
        "uuid": "3f009ce4-141f-4947-b523-4990b3a3bcd7",
        "location": "test_1",
        "nodeid": "tests/tests/test_1.py::test_1",
        "testRunUuid": "eb591dc8-cd0a-4a92-ac9d-b3e16d6033cb",
        "description": None,
        "startedAt": "2024-04-11T15:45:45Z",
        "stoppedAt": "2024-04-11T15:45:45Z",
        "status": "PASSED",
    },
    {
        "uuid": "eb8a7997-b93c-4a4a-8fbc-419c61770007",
        "location": "test_1",
        "nodeid": "tests/tests/test_1.py::test_1",
        "testRunUuid": "c6cd08b7-c11f-4af5-a0de-d0d29e0625d5",
        "description": None,
        "startedAt": "2024-04-11T15:46:00Z",
        "stoppedAt": "2024-04-11T15:46:00Z",
        "status": "PASSED",
    },
]
