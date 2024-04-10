import os

from dotenv import load_dotenv


class DefaultSettings:
    def __init__(self):
        self.settings = {
            "mongo_url": {
                "default": "mongodb://localhost:27017/",
                "env_var": "MONGO_URL",
            },
            "database_name": {"default": "mydatabase", "env_var": "DATABASE_NAME"},
            "broker_url": {"default": "redis://redis:6379/0", "env_var": "BROKER_URL"},
            "celery_result_backend": {
                "default": "redis://redis:6379/0",
                "env_var": "CELERY_RESULT_BACKEND",
            },
            "initry_api_external_port": {
                "default": "8000",
                "env_var": "INITRY_API_EXTERNAL_PORT",
            },
            "initry_grpc_external_port": {
                "default": "50051",
                "env_var": "INITRY_GRPC_EXTERNAL_PORT",
            },
            "initry_frontend_external_port": {
                "default": "3000",
                "env_var": "{INITRY_FRONTEND_EXTERNAL_PORT}",
            },
        }

    def load_environment_variables(self):
        for setting, values in self.settings.items():
            os.environ.setdefault(values["env_var"], values["default"])


class Settings(DefaultSettings):
    def __init__(self):
        super().__init__()
        # Load environment variables from environment-specific .env file
        self.load_environment_variables()

    def load_environment_variables(self):
        env_file = next((f for f in os.listdir() if f.startswith(".env")), None)
        if env_file is not None:
            if os.path.exists(env_file):
                load_dotenv(dotenv_path=env_file, override=True)
        # Load defaults to fill in missing items from the new configuration.
        super().load_environment_variables()

    @staticmethod
    def get(key):
        return os.getenv(key)
