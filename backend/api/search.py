
from fastapi import APIRouter

from schemas.search import SearchRequest, SearchResponse
from services.search import SearchService

search_router = APIRouter(prefix="/api/search")
search_service = SearchService()


@search_router.post(
    "/",
    operation_id="postSearchTestsByName",
    response_model=SearchResponse,
    tags=["Search"],
)
def post_search_tests_by_name(search: SearchRequest):
    result, count = search_service.get_tests_by_name(search.name, search.status)
    for item in result:
        del item["_id"]
    return {"data": result, "count": count }
