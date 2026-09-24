# College Service Request System - Backend

This backend follows the requested simple FastAPI + MongoDB CRUD style.

## Structure

- admin: authentication, users, service categories
- student: Student/Faculty request CRUD
- staff: Service Staff/Lead request processing
- db folders: MongoDB collections
- main.py: FastAPI application entry point

## Install

pip install -r requirements.txt

## Start MongoDB

Make sure MongoDB is running locally at:

mongodb://localhost:27017

## Run

From the backend folder:

uvicorn main:app --reload

Swagger:

http://127.0.0.1:8000/docs

## Important

No .env file is used. MongoDB URL and JWT secret are kept directly in Python to match the taught project style.

Roles used:

ADMIN
STUDENT
FACULTY
SERVICE_STAFF
SERVICE_LEAD

Authentication:
1. POST /register
2. POST /login
3. Copy access_token
4. In Swagger/Postman use:
   Authorization: Bearer <token>
