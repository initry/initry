import json
import os

from fastapi.openapi.utils import get_openapi

from main import app

with open("openapi.json", "w") as f:
    json.dump(
        get_openapi(
            title=app.title,
            version=app.version,
            openapi_version=app.openapi_version,
            description=app.description,
            routes=app.routes,
            servers=[
                {"url": f"http://localhost:{os.getenv('INITRY_API_EXTERNAL_PORT')}"}
            ],
        ),
        f,
    )
