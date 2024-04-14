from pytest_mock import MockerFixture
from tests.main import client
from copy import deepcopy

class TestApiSearch:

    item_1 = {
        "_id": "1",
        "uuid": "b63dde90-2df6-4ae6-8ac3-8c8d396d3969",
        "location": "test_0",
        "nodeid": "tests/tests/test_0.py::test_0",
        "testRunUuid": "a88c5996-ee6d-4c1c-a848-f30ad93ef548",
        "description": None,
        "startedAt": "2024-04-11T15:48:37Z",
        "stoppedAt": "2024-04-11T15:48:37Z",
        "status": "PASSED",
    }

    item_2 = {
        "_id": "2",
        "uuid": "b63dde90-2df6-4ae6-8ac3-8c8d396d3968",
        "location": "test_0",
        "nodeid": "tests/tests/test_0.py::test_0",
        "testRunUuid": "a88c5996-ee6d-4c1c-a848-f30ad93ef548",
        "description": None,
        "startedAt": "2024-04-11T15:48:37Z",
        "stoppedAt": "2024-04-11T15:48:37Z",
        "status": "PASSED",
    }

    def test__search_by_name_single(self, mocker: MockerFixture):
        item_1 = deepcopy(self.item_1)
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([item_1], 1))
        response = client.post("/api/search/", json={"name": "test_0", "status": None})
        assert response.status_code == 200
        assert response.json() == {"data": [item_1], "count": 1}

    def test__search_by_name_multiple(self, mocker: MockerFixture):
        item_1 = deepcopy(self.item_1)
        item_2 = deepcopy(self.item_2)
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([item_1, item_2], 2))
        response = client.post("/api/search/", json={"name": "test_0", "status": None})
        assert response.status_code == 200
        assert response.json() == {"data": [item_1, item_2], "count": 2}

    def test_search_by_name_single_and_status(self, mocker: MockerFixture):
        item_1 = deepcopy(self.item_1)
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([item_1], 1))
        response = client.post("/api/search/", json={"name": "test_0", "status": "PASSED"})
        assert response.status_code == 200
        assert response.json() == {"data": [item_1], "count": 1}

    def test_search_by_name_single_empty(self, mocker: MockerFixture):
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([], 0))
        response = client.post("/api/search/", json={"name": "test_0"})
        assert response.status_code == 200
        assert response.json() == {"data": [], "count": 0}

    def test_search_by_name_single_and_status_empty(self, mocker: MockerFixture):
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([], 0))
        response = client.post("/api/search/", json={"name": "test_0", "status": "PASSED"})
        assert response.status_code == 200
        assert response.json() == {"data": [], "count": 0}

    def test_search_no_name_field(self, mocker: MockerFixture):
        mocker.patch("services.search.SearchService.get_tests_by_name",
                     return_value=([], 0))
        response = client.post("/api/search/", json={"name1": "test_0", "status": "PASSED"})
        assert response.status_code == 422

