import asyncio
from functools import partial

from starlette.websockets import WebSocket, WebSocketState


# Enhance the "WebSocket" class with "channel" functionality
class WebSocketWithRoute(WebSocket):
    def __init__(self, channel, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel = channel


class WebsocketManager:
    def __init__(self):
        self.active_connections: list[WebSocketWithRoute] = []
        self.active_connection: WebSocketWithRoute
        self.message_queue = []

    async def connect(self, websocket: WebSocketWithRoute):
        await websocket.accept()
        self.active_connections.append(websocket)

        connections_to_remove = []

        for connection in self.active_connections:
            if connection.client_state != WebSocketState.CONNECTED:
                connections_to_remove.append(connection)
                continue
            break

        for conn in connections_to_remove:
            self.active_connections.remove(conn)

    async def broadcast(self, message, channel=None, channels=None):
        for conn in self.active_connections:
            if channel and conn.channel == channel:
                await conn.send_json(message)
            if channels and conn.channel in channels:
                await conn.send_json(message)

    def add(self, message, channel):
        self.message_queue.append(partial(self.broadcast, message, channel))

    async def send_messages(self):
        while True:
            async with asyncio.TaskGroup() as tg:
                mq = self.message_queue.copy()
                self.message_queue.clear()
                for msg in mq:
                    tg.create_task(msg())
                await asyncio.sleep(1)

    def disconnect(self, websocket: WebSocketWithRoute = None, channel=None):
        if channel:
            connections_to_remove = [
                conn for conn in self.active_connections if conn.channel == channel
            ]
        else:
            connections_to_remove = [websocket]
        for conn in connections_to_remove:
            self.active_connections.remove(conn)

    def is_channel_open(self, channel):
        for conn in self.active_connections:
            if conn.channel == channel:
                return True
        return False


wsm = WebsocketManager()
