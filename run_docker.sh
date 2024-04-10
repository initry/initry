#!/bin/bash

# Find the first .env file within the backend folder and get its filename
BACKEND_ENV_FILE=$(find ./backend -maxdepth 1 -type f -name ".env*" | head -n 1)

# Find the first .env file within the frontend folder and get its filename
FRONTEND_ENV_FILE=$(find ./frontend -maxdepth 1 -type f -name ".env*" | head -n 1)

# Check if both backend and frontend .env files were found
if [ -n "$BACKEND_ENV_FILE" ] && [ -n "$FRONTEND_ENV_FILE" ]; then
    # Run Docker Compose with both backend and frontend .env files
    docker compose --env-file "$BACKEND_ENV_FILE" --env-file "$FRONTEND_ENV_FILE" up --build --force-recreate

elif [ -n "$BACKEND_ENV_FILE" ]; then
    # Run Docker Compose with the backend .env file
    docker compose --env-file "$BACKEND_ENV_FILE" up --build --force-recreate

elif [ -n "$FRONTEND_ENV_FILE" ]; then
    # Run Docker Compose with the frontend .env file
    docker compose --env-file "$FRONTEND_ENV_FILE" up --build --force-recreate

else
    # Run Docker Compose without specifying an env file
    docker compose up --build --force-recreate

fi

