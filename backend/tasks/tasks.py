from celery import Celery

from settings.settings import Settings

settings = Settings()
celery = Celery(
    __name__,
    broker=settings.get("BROKER_URL"),
    backend=settings.get("CELERY_RESULT_BACKEND"),
    include=["tasks.test_run_finalization"],
)
