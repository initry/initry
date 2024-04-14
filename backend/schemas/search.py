from typing import Optional

from pydantic import BaseModel
from schemas.test import Test


class SearchRequest(BaseModel):
    name: str
    status: Optional[str] = None

class SearchResponse(BaseModel):
    data: list[Test] | list
    count: int
