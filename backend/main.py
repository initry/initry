import asyncio
import logging
import threading
from concurrent import futures
from contextlib import asynccontextmanager

import grpc
import pymongo
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.models import Server

from api.search import search_router
from api.stats import stats_router
from api.test_runs import test_run_router
from api.tests import tests_router
from database.mongo import MongoDB
from protobufs import test_pb2_grpc, test_run_pb2_grpc, tests_pb2_grpc
from services.grpc import ClientStreamTestServiceHandler, \
                          TestRunServiceHandler, TestServiceHandler, \
                          TestsServiceHandler
from settings import Settings
from ws.routes import ws_router
from ws.ws import wsm

# Logger config
logging.config.fileConfig("logging.conf", disable_existing_loggers=False)

# Get root logger
logger = logging.getLogger(__name__)

mongo_instance = MongoDB()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    mongo_instance.db["test_runs"].create_index(
        [("uuid", pymongo.ASCENDING)], unique=True
    )
    mongo_instance.db["test_runs"].create_index([("startedAt", pymongo.ASCENDING)])
    mongo_instance.db["tests"].create_index([("uuid", pymongo.ASCENDING)], unique=True)
    mongo_instance.db["tests"].create_index([("testRunUuid", pymongo.ASCENDING)])
    mongo_instance.db["tests"].create_index([("nodeid", pymongo.ASCENDING)])
    mongo_instance.db["test_logs"].create_index(
        [("uuid", pymongo.ASCENDING)], unique=True
    )
    mongo_instance.db["test_runs_raw"].create_index([("uuid", pymongo.ASCENDING)])

    loop = asyncio.get_event_loop()
    loop.create_task(wsm.send_messages())
    yield


settings = Settings()

server = Server(url=f"http://localhost:{settings.get('INITRY_API_EXTERNAL_PORT')}")

app = FastAPI(
    lifespan=lifespan,
    title="Initry backend",
    version="0.4.0",
    servers=[{"url": f"http://localhost:{settings.get('INITRY_API_EXTERNAL_PORT')}"}],
)

# gRPC server configuration
grpc_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
test_run_pb2_grpc.add_TestRunServiceServicer_to_server(
    TestRunServiceHandler(), grpc_server
)
tests_pb2_grpc.add_TestsServiceServicer_to_server(TestsServiceHandler(), grpc_server)
test_pb2_grpc.add_TestServiceServicer_to_server(TestServiceHandler(), grpc_server)
test_pb2_grpc.add_ClientStreamTestServiceServicer_to_server(
    ClientStreamTestServiceHandler(), grpc_server
)

# gRPC server port
grpc_server.add_insecure_port(f"[::]:{settings.get('INITRY_GRPC_EXTERNAL_PORT')}")

# gRPC server in a separate thread
grpc_thread = threading.Thread(target=grpc_server.start)
grpc_thread.start()


# Routing
app.include_router(test_run_router)
app.include_router(ws_router)
app.include_router(tests_router)
app.include_router(stats_router)
app.include_router(search_router)


origins = settings.get('INITRY_BACKEND_CORS_LIST')

# https://github.com/tiangolo/fastapi/discussions/10968
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=settings.get("INITRY_API_EXTERNAL_PORT"))
