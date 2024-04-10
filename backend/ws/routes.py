from fastapi import APIRouter
from starlette.websockets import WebSocketDisconnect

from ws.ws import WebSocketWithRoute, wsm

ws_router = APIRouter(prefix="/ws")


@ws_router.websocket("/live")
async def ws_live(websocket: WebSocketWithRoute):
    await wsm.connect(websocket)
    websocket.channel = "live"
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        wsm.disconnect(websocket)


@ws_router.websocket("/test-run/{test_run_id}")
async def ws_test_run(websocket: WebSocketWithRoute, test_run_id: str):
    await wsm.connect(websocket)
    websocket.channel = f"test-run/{test_run_id}"
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        wsm.disconnect(websocket)
