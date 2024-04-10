# initry backend
### Dev notes

Prerequisites:
 - Poetry
 - Pyenv (for Python 3.11)

1. **Start Redis docker container**:
    ```
    docker run -d --name redis -p 6379:6379 redis
    ```
 2. **Create `.env` file based on `env.example` in the `backend` folder.**
    ```bash
    INITRY_API_EXTERNAL_PORT=8000
    INITRY_GRPC_EXTERNAL_PORT=50051
    INITRY_FRONTEND_EXTERNAL_PORT=3000
    MONGO_URI=mongodb://localhost:27017/  <--- configure your MongoDB host
    DATABASE_NAME=database    <--- configure your MongoDB database name
    BROKER_URL=redis://redis:6379/0
    CELERY_RESULT_BACKEND=redis://redis:6379/0
    ```
3. **Go to `backend` folder and configure pyenv**:
    ```
    pyenv local 3.11
   ```
4. **In the `backend` folder configure and install poetry environment**:
   ```
   poetry use 3.11
   poetry install
   ```
5. **Activate poetry environment**:
   ```
   poetry shell
   ```
6. **Run backend (from poetry shell)**:
   ```
   python -m uvicorn main:app --reload
   ```
7. **Run Celery worker**:
   ```
   celery -A tasks.tasks worker -l INFO
   ```
   

### Additional

**gRPC**
  - .proto files can be found in `proto` folder.
  - To build protofiles execute:
    ```
    cd backend/proto
    ./run.sh
    ```
  - Move generated files to `backend/protobufs` folder.

**OpenAPI**

 - To build frontend client execute:<br>
    ```
    cd backend/openapi-codegen
    ./run.sh
    ```
 - Move generated `client` folder to `frontend` folder.

**Requirements.txt**

 - If you add some new dependencies to the Poetry, please generate requirements.txt for the Docker env:
   ```
   poetry export --without-hashes --format=requirements.txt > requirements.txt
   ```
   

