# initry


initry is a reporting system for automation tests. Currently it supports the Pytest framework.

#### How does Initry work? 
A pytest plugin collects the execution statuses of test cases and sends them to the Initry backend.
You can review test runs and tests that are in progress or have been completed.

initry consists of:
 - Frontend (Next.js)
 - Backend (FastAPI)
 - Pytest plugin.

Communication between the backend and frontend is organized via gRPC.


### Requirements
 - Python 3.11.8
 - MongoDB 7

### Configuration

Before running Initry, make sure to set up your environment:

1. Navigate to the `backend` folder and create your `.env` file by copying the `env.example` file:
    ```
    cp env.example .env
    ```

2. Configure the `.env` file based on your settings. Open the `.env` file and set values for the environment variables. 
3. Navigate to the `frontend` folder, create your `.env` file by copying the `env.example` file and do the necessary changes in envs based on your settings:
    ```
    cp env.example .env
    ```

### Running Initry

To run Initry, follow these steps:

1. Navigate back to the root folder of Initry.

2. Execute the `run_docker.sh` script:
    ```
    ./run_docker.sh
    ```

This will start Initry with the specified environment settings. 

3. Open http://localhost:3000

### Install pytest-initry

To collect test results you need to install the [pytest-initry](https://github.com/initry/pytest-initry) library.


### Optional

Change API port:
 - Configure `INITRY_API_EXTERNAL_PORT` in your `.env` file.

Change Frontend port:
 - Configure `INITRY_FRONTEND_EXTERNAL_PORT` in your `.env` file.
