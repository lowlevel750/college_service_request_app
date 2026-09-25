from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from admin import admin
from student import student
from staff import staff

app = FastAPI(title="College Service Request System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for sub_app in [admin.app, student.app, staff.app]:
    for route in sub_app.routes:
        if route.path not in ["/openapi.json", "/docs", "/docs/oauth2-redirect", "/redoc"]:
            app.routes.append(route)


@app.get("/")
def root():
    return {"message": "College Service Request System API is running"}


@app.get("/health")
def health():
    return {"status": "OK"}
